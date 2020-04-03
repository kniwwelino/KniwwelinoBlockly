/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"): http://www.apache.org/licenses/LICENSE-2.0
 * 
 * @fileoverview Tutorial Runner for Arduino Tutorial.
 */
(function(w) {
    "use strict";
    w.define(['helpers', 'json!conf/config.json', 'sprintf', 'jquery', 'vkBeautify'], function(h, conf, sprintf, $, vkBeautify) {
        const blockly = w.Blockly;
        const ardublockly = w.Ardublockly;
        let stepIndex = 0;
        let _data;
        let $dokuwikiCss;
        let toolboxXmlBackup;
        let onRunnerReadyCb;
        const STYLE_CLASS_OK = "tutoOk";
        const STYLE_CLASS_PARTIAL_OK_NO_CHILD = "tutoOkPartialNoChild";
        const STYLE_CLASS_PARTIAL_OK_WITH_CHILD = "tutoOkPartialWithChild";
        const AUTO_VALIDATION = false;
        let ranOnce = false;
        let paused = false;
        let fatal = function() {
            throw new (h.CommonError)(arguments);
        };

        /**
         * Entry point, initialize the runner
         * 
         * @param {Object} data The tutorial data
         * @param {function()} readyCb Callback when runner is ready
         * @param {function()} fatalCb Callback on failure
         * 
         * @return {void} Nothing
         */
        function init(data, readyCb, fatalCb) {
            // clean up ?
            if (ranOnce) {
                close();
            } else {
                // backup Toolbox
                toolboxXmlBackup = ardublockly.TOOLBOX_XML;
                // bind workspace events
                ardublockly.workspace.addChangeListener(onWorkspaceEvent);
            }
            ranOnce = true;
            // callbacks
            if (typeof fatalCb === typeof function() { }) {
                fatal = fatalCb;
            }
            onRunnerReadyCb = readyCb;
            // store data
            _data = data;
            // load css
            fetchDokuwikiCss();
        }
        /**
         * When workspace changed
         * 
         * @param {Event} event Event due to user action
         * 
         * @return {void} Nothing
         */
        function onWorkspaceEvent(event) {
            if (!_data || paused) {
                return;
            }
            if (![Blockly.Events.CHANGE, Blockly.Events.MOVE].includes(event.type)) {
                return;
            }
            validateAuto();
        }
        /**
         * Validate automatically the user response
         * 
         * @return {void} Nothing
         */
        function validateAuto() {
            if (!AUTO_VALIDATION) {
                resetBlockHighlighting();
                return;
            }
            if (!_data) {
                return;
            }
            let bestSolution = selectBestSolution(analyseResponse());
            feedbackColor(bestSolution);
            feedbackAuto(bestSolution);
        }
        /**
         * Collect blocks in solutions of the current step
         * 
         * @return {Element[]} List of block types
         */
        function collectSolutionBlocks() {
            let types = _data['steps'][stepIndex]['solutionsXml'].map(xml => $(xml).find("block"))
                .reduce(($a, $b) => $a.add($b), $()).toArray();
            // unique
            return Array.from(new Set(types));
        }
        /**
         * Restrict toolbox elements
         * 
         * @return {void} Nothing
         */
        function restrictToolbox() {
            if (!_data || stepIndex >= _data['steps'].length) {
                return;
            }
            let solutionBlocks = collectSolutionBlocks();
            // get default toolbox dom
            let $toolbox = $(toolboxXmlBackup);
            let $cats = $toolbox.find("category");

            // FILTER BLOCKS NOT LINKED TO CATEGORIES
            let xmlSerializer = new w.XMLSerializer();
            let inSolutionBlocks = function(solBlocks, block, catId) {
                let type = block.getAttribute("type");
                //same type
                let sameTypeSolBlocks = solBlocks.filter(b => (b.getAttribute("type") == type));
                // same category if category available
                let matches = sameTypeSolBlocks.filter(solBlock => {
                    let b_id = solBlock.getAttribute("id");
                    if (b_id == null) {
                        // no id, keep it
                        return true;
                    }
                    let customId = ardublockly.toolbox_helpers.getCustomId(b_id);
                    if (customId == null) {
                        // no category id, keep it
                        return true;
                    }
                    if (customId.custom != catId) {
                        // not the same category, discard it
                        return false;
                    }
                    // same category, keep it
                    return true;
                });
                // FILTER MUTATION
                //                let $block = $(block);
                //                let hasValidMutation = function(target) {
                //                    let refMutation = $block.children("mutation").get(0);
                //                    let targetMutation = $(target).children("mutation").get(0);
                //                    if (!targetMutation) {
                //                        return false;
                //                    }
                //                    let format = function(target) {
                //                        return $(vkBeautify.xmlmin(xmlSerializer.serializeToString(target), true)).get(0);
                //                    };
                //                    return format(targetMutation).isEqualNode(format(refMutation));
                //                };
                //                // if mutation in block keep only corresponding mutations
                //                if (($block.children("mutation").length != 0)) {
                //                    matches = matches.filter(hasValidMutation);
                //                }
                return (matches.length != 0);
            };
            $cats.each((_i, cat) => {
                let $cat = $(cat);
                let $blocks = $cat.find("block");
                let catId = $cat.attr("id");
                $blocks.filter((_i, b) => !inSolutionBlocks(solutionBlocks, b, catId)).remove();
            })
                // disable unneeded categories
                .filter((_i, cat) => !$(cat).find("block").length).remove();

            // update toolbox
            // ardublockly.workspace.updateToolbox($toolbox.get(0));
            ardublockly.TOOLBOX_XML = xmlSerializer.serializeToString($toolbox.get(0));
            ardublockly.TOOLBAR_SHOWING_SIMPLE_ = !ardublockly.TOOLBAR_SHOWING_SIMPLE_;
            ardublockly.toogleToolboxSimple();
        }
        /**
         * When the dokuwiki css is fetched
         * 
         * @param {string} data The css content
         * 
         * @return {void} Nothing
         */
        function onDokuwikiCssFetched(data) {
            $dokuwikiCss = $('<style />').text(data);
            $('#tutoButtonValidate').attr("title", getLocalStr('tutoValidateBtTitle'));
            // display info
            populate();
            // clean workspace
            prepareWorkspace();
            // showtime
            $('#tuto_area').removeClass('hide');
            $('#tutoButtonValidate').removeClass('hide');
            if (typeof onRunnerReadyCb === typeof function() { }) {
                onRunnerReadyCb();
            }
        }
        /**
         * Prepare blokcs in the workspace
         * 
         * @return {void} Nothing
         */
        function prepareWorkspace() {
            ardublockly.workspace.clear();
            ardublockly.DEFAULT_PROJECT = ardublockly.DEFAULT_PROJECT_NAME;
            ardublockly.loadXmlBlockFile(ardublockly.DEFAULT_PROJECT, function() {
                ardublockly.sketchNameSet(getLocalStr('sketchName'));
                ardublockly.renderContent();
                // filter workspace blocks with toolbox content
                let workspace = ardublockly.workspace;
                let toolboxBlockTypes = $(new w.XMLSerializer().serializeToString(ardublockly.xmlTree)).find("block").toArray().map(b => b.getAttribute("type"));
                workspace.getTopBlocks(false).filter(b => !toolboxBlockTypes.includes(b.type)).forEach(b => b.dispose());
            });
        }
        /**
         * Fetch the dokuwiki css file
         * 
         * @return {void} Nothing
         */
        function fetchDokuwikiCss() {
            $.ajax({
                type: "GET",
                url: conf.tutoWikiCss,
                dataType: 'text',
                headers: {
                    Accept: "text/css"
                }
            }).done(onDokuwikiCssFetched).fail(function() {
                fatal(sprintf.sprintf("failed to load file: %s", this.url), getLocalStr('tutorialError'), getLocalStr('tutorialNotEnoughDataError'));
            });
        }
        /**
         * Populate the runner
         * 
         * @return {void} Nothing
         */
        function populate() {
            $('#tuto_area h5').first().text(_data['title']);
            let steps = _data['steps'];
            if (steps) {
                populateStep(steps[stepIndex]);
            }
        }
        /**
         * Populate the runner with the current step content
         * 
         * @param {Object} step The step
         * 
         * @return {void} Nothing
         */
        function populateStep(step) {
            // step number
            $('#tutoStepIndex').text(stepIndex + 1);
            // get step
            let $step = step['$html'].find('body').clone().children();
            // relative link goes absolute
            $step.find('img[src]').each(function(_i, el) {
                let $el = $(el);
                try {
                    new URL($el.attr('src'));
                } catch (e) {
                    //relative path
                    $el.attr('src', conf.tutorialUrlEnforcement + $el.attr('src'));
                }
            });
            // build display
            let $tutoStep = $('#tutoStep');
            let shadowRoot = $tutoStep.get(0).shadowRoot;
            if (!shadowRoot) {
                shadowRoot = $tutoStep.get(0).attachShadow({ mode: 'open' });
            }
            Array.from(shadowRoot.children).forEach(el => $(el).remove());
            $(shadowRoot).append($dokuwikiCss, $step);
            resume();
            updateNavBts();
        }
        /**
         * Close the runner by cleaning its content
         * 
         * @return {void} Nothing
         */
        function close() {
            // remove UI
            $('#tuto_area').addClass('hide');
            $('#tutoButtonValidate').addClass('hide');
            restoreToolbox();
            resetBlockHighlighting();
            // reset data
            stepIndex = 0;
            _data = null;
        }
        /**
         * Analyse the user response
         * 
         * @return {Object[]} Analysis reports, one per available/possible solution
         */
        function analyseResponse() {
            let xmlDom = blockly.Xml.workspaceToDom(ardublockly.workspace);
            if (!(xmlDom instanceof w.Node)) {
                h.log(xmlDom);
                fatal("not a valid Node", getLocalStr('tutorialError'), getLocalStr('tutorialNotEnoughDataError'));
            }

            let getCleanBlock = function(b) {
                let $b = $(b).clone();
                // for current block and children
                $b.add($b.find("block")).removeAttr("x").removeAttr("y").removeAttr("id");
                // for shadow block
                $b.find("shadow").removeAttr("id");
                return $b.get(0);
            };
            let getCleanBlock0 = function(b) {
                let $b0 = $(getCleanBlock(b));
                $b0.find("block, statement, value, field").remove();
                return $b0.get(0);
            };
            let getPreparedMetaBlocks = function(xml) {
                return $(vkBeautify.xmlmin(xml, true)).find("block").map((_i, b) => {
                    return { id: $(b).attr("id"), b: getCleanBlock(b), original: b, b0: getCleanBlock0(b), nestedLen: $(b).find("block").length };
                });
            };
            let $responseBlocks = getPreparedMetaBlocks(new w.XMLSerializer().serializeToString(xmlDom));
            let solutions = _data['steps'][stepIndex]['solutionsXml'];
            let results = [];
            for (let solution of solutions) {
                // block type validation
                let $solutionBlocks = getPreparedMetaBlocks(solution);
                let solutionBlocksOnlyType = $solutionBlocks.toArray();
                let responseBlocksOnlyType = $responseBlocks.toArray();
                let sameBlocksOnlyType = [];
                // reverse looping to allow removal
                solutionLoop:
                for (let i = (solutionBlocksOnlyType.length - 1); i >= 0; i--) {
                    // check in response
                    for (let j = (responseBlocksOnlyType.length - 1); j >= 0; j--) {
                        if ($(responseBlocksOnlyType[j].b).attr("type") == $(solutionBlocksOnlyType[i].b).attr("type")) {
                            sameBlocksOnlyType.push(responseBlocksOnlyType[j]);
                            responseBlocksOnlyType.splice(j, 1);
                            solutionBlocksOnlyType.splice(i, 1);
                            continue solutionLoop;
                        }
                    }
                }

                // strict validation (content and children)
                let $sameBlocks = $responseBlocks.filter((_i, rMb) => $solutionBlocks.filter((_si, sMb) => rMb.b.isEqualNode(sMb.b)).length);

                // stric validation, avoid duplications
                let sortByImportance = function(Mb_a, Mb_b) {
                    let aAfterIfpositive = $(Mb_a.b).find("block").length - $(Mb_b.b).find("block").length;
                    return aAfterIfpositive;
                }
                let strictBlocksToParse = $responseBlocks.toArray().sort(sortByImportance);
                let strictExtraBlocks = $responseBlocks.toArray();
                let strictMissingBlocks = $solutionBlocks.toArray().sort(sortByImportance);
                let strictSameBlocks = [];
                let currentBlock;
                let xmlSerializer = new w.XMLSerializer();
                while (currentBlock = strictBlocksToParse.pop()) {
                    //check in missing blocks
                    let sameIndex = strictMissingBlocks.findIndex(Mb => Mb.b.isEqualNode(currentBlock.b));
                    if (sameIndex != -1) {
                        // add to same blocks
                        strictSameBlocks.push(currentBlock);
                        // remove from missing
                        strictMissingBlocks.splice(sameIndex, 1);
                        // remove from extra with id
                        strictExtraBlocks.splice(strictExtraBlocks.findIndex(Mb => Mb.id == currentBlock.id), 1);
                        // deal with nested blocks
                        getPreparedMetaBlocks(xmlSerializer.serializeToString(currentBlock.original)).toArray().forEach(Mb => {
                            // add to same block
                            strictSameBlocks.push(Mb);
                            // remove from missing
                            strictMissingBlocks.splice(strictMissingBlocks.findIndex(cMb => cMb.b.isEqualNode(Mb.b)), 1);
                            // remove from extra
                            strictExtraBlocks.splice(strictExtraBlocks.findIndex(cMb => cMb.id == Mb.id), 1);
                        });
                    }
                }
                // Partial validation (block values validation, not nested blocks)
                let partialBlocksToParse = Array.from(strictExtraBlocks);
                let partialExtraBlocks = Array.from(strictExtraBlocks);
                let partialMissingBlocks = Array.from(strictMissingBlocks);
                let partialSameBlocks = [];
                while (currentBlock = partialBlocksToParse.pop()) {
                    //check in missing blocks
                    let sameIndex = partialMissingBlocks.findIndex(Mb => Mb.b0.isEqualNode(currentBlock.b0));
                    if (sameIndex != -1) {
                        // add to same blocks
                        partialSameBlocks.push(currentBlock);
                        // remove from missing
                        partialMissingBlocks.splice(sameIndex, 1);
                        // remove from extra with id
                        partialExtraBlocks.splice(partialExtraBlocks.findIndex(Mb => Mb.id == currentBlock.id), 1);
                    }
                }
                results.push({
                    $responseBlocks: $responseBlocks,
                    $solutionBlocks: $solutionBlocks,
                    sameBlocksOnlyType: sameBlocksOnlyType,
                    missingBlocksOnlyType: solutionBlocksOnlyType,
                    extraBlocksOnlyType: responseBlocksOnlyType,
                    $sameBlocks: $sameBlocks,
                    strictSameBlocks: strictSameBlocks,
                    strictMissingBlocks: strictMissingBlocks,
                    strictExtraBlocks: strictExtraBlocks,
                    partialSameBlocks: partialSameBlocks,
                    partialMissingBlocks: partialMissingBlocks,
                    partialExtraBlocks: partialExtraBlocks,
                });
            }
            return results;
        }
        /**
         * Validatation, on-demand/ manual one
         * 
         * @return {void} Nothing
         */
        function validate() {
            let bestSolution = selectBestSolution(analyseResponse());
            feedbackColor(bestSolution);
            feedbackMessage(bestSolution);
        }
        /**
         * Reset the highlighing of workspace blocks
         * 
         * @return {void} Nothing
         */
        function resetBlockHighlighting() {
            ardublockly.workspace.getAllBlocks(false).forEach(function(b) {
                b.svgPath_.classList.remove(STYLE_CLASS_OK, STYLE_CLASS_PARTIAL_OK_WITH_CHILD, STYLE_CLASS_PARTIAL_OK_NO_CHILD, STYLE_CLASS_PARTIAL_OK_NO_CHILD);
                b.svgPathLight_.classList.remove(STYLE_CLASS_OK, STYLE_CLASS_PARTIAL_OK_WITH_CHILD, STYLE_CLASS_PARTIAL_OK_NO_CHILD, STYLE_CLASS_PARTIAL_OK_NO_CHILD);
            });
        }
        /**
         * highlight workspace blocks
         * 
         * @param {Object} report The analysis result that needs highlighting
         * 
         * @return {void} Nothing
         */
        function feedbackColor(report) {
            resetBlockHighlighting();
            let strictIds = report.strictSameBlocks.map(Mb => Mb.id);
            ardublockly.workspace.getAllBlocks(false).forEach(function(b) {
                let clazz = "";
                if (strictIds.includes(b.id)) {
                    clazz = STYLE_CLASS_OK;
                } else {
                    let partial = report.partialSameBlocks.find(Mb => Mb.id == b.id);
                    if (partial) {
                        clazz = (partial.nestedLen) ? STYLE_CLASS_PARTIAL_OK_WITH_CHILD : STYLE_CLASS_PARTIAL_OK_NO_CHILD;
                    }
                }
                if (clazz) {
                    b.svgPath_.classList.add(clazz);
                    b.svgPathLight_.classList.add(clazz);
                }
            });
        }
        /**
         * Select the best solution regarding the user response
         * 
         * @param {Object[]} results Response analysis results
         * 
         * @return {Object} Best analysis result
         */
        function selectBestSolution(results) {
            results.sort(function(a, b) {
                // sort by same blocks
                let aAfterIfpositive = a.strictSameBlocks.length - b.strictSameBlocks.length;
                if (aAfterIfpositive == 0) {
                    // select one with less missing
                    aAfterIfpositive = b.strictMissingBlocks.length - a.strictMissingBlocks.length;
                }
                if (aAfterIfpositive == 0) {
                    // select shorter solution
                    aAfterIfpositive = b.$solutionBlocks.length - a.$solutionBlocks.length;
                }
                return aAfterIfpositive;
            });
            // get last
            return results.pop();
        }
        /**
         * Automatic feedback
         * 
         * @param {Object} report Response analysis result
         * 
         * @return {void} Nothing
         */
        function feedbackAuto(report) {
            // pop-up
            if (report.strictSameBlocks.length == report.$solutionBlocks.length) {
                feedBackMessageGood(report);
            }
            h.log("Analyse result: ", report);
        }
        /**
         * Display message for good answer
         * 
         * @param {Object} report Response analysis result
         * 
         * @return {void} Nothing
         */
        function feedBackMessageGood(report) {
            let msg = "";
            // extra block
            if (report.strictExtraBlocks.length) {
                let format = (report.strictExtraBlocks.length == 1) ? 'tutoAnalyseResultStillExtraBlocks1' : 'tutoAnalyseResultStillExtraBlocks';
                msg += sprintf.sprintf(getLocalStr(format), report.strictExtraBlocks.length) + "<br />";
            } else {
                // perfect
                // is last step ?
                let compileBt = `<a id="tutoAnalysisCompile" 
                    class="button_ide_large waves-effect waves-light waves-circle z-depth-1-half arduino_orange tutoButton tutoButtonValidate disabled grey">
                    <i class="mdi-av-play-arrow"></i></a>`;
                if ((stepIndex + 1) >= _data['steps'].length) {
                    msg += getLocalStr("tutoTutoEnded") + "<br />";
                    msg += getLocalStr("tutoStepHardwareTest") + compileBt + "<br />";
                    let endTutoBt = `<a id="tutoAnalysisGotoTutoList" href="#"><i class="mdi-social-school left"></i></a>`;
                    msg += getLocalStr("tutoTutoEndedNextOne") + endTutoBt;
                } else {
                    // not the last step
                    msg += getLocalStr("tutoStepEnded") + "<br />";
                    msg += getLocalStr("tutoStepHardwareTest") + compileBt + "<br />";
                    let nextStepBt = `<a id="tutoAnalysisGotoNextStep" 
                        class="button_ide_large waves-effect waves-light waves-circle z-depth-1-half arduino_orange tutoButton tutoNavButton">
                        <i class="mdi-navigation-chevron-right"></i></a>`;
                    msg += getLocalStr("tutoStepEndedNextOne") + nextStepBt;
                }
            }
            displayAnalysisMessage(getLocalStr('tutoGoodAnswer'), msg);
            $("#tutoAnalysisGotoTutoList").click(_e => {
                $('#tutorialAnalysisResult').closeModal();
                $('#tutorialMenu').openModal();
            });
            $("#tutoAnalysisGotoNextStep").click(_e => {
                $('#tutorialAnalysisResult').closeModal();
                next();
            });
            $("#tutoAnalysisCompile").filter((_i, _el) => {
                let bt = $("#button_ide_large");
                return !(bt.hasClass('grey') || bt.hasClass('disabled'));
            }).removeClass("grey disabled").click(_e => {
                $("#button_ide_large i").click();
                $('#tutorialAnalysisResult').closeModal();
            });
        }
        /**
         * Feedback message
         * 
         * @param {Object} report Response analysis result
         * 
         * @return {void} Nothing
         */
        function feedbackMessage(report) {
            // pop-up
            if (report.strictSameBlocks.length == report.$solutionBlocks.length) {
                feedBackMessageGood(report);
                return;
            }
            let msg = "";
            let format = (report.$solutionBlocks.length <= 1) ? 'tutoAnalyseResultSolutionNbOfBlocks1' : 'tutoAnalyseResultSolutionNbOfBlocks';
            msg += sprintf.sprintf(getLocalStr(format), report.$solutionBlocks.length);
            msg += "<br /><br />" + getLocalStr('tutoAnalyseResultResponseIntro');
            format = (report.strictSameBlocks.length <= 1) ? 'tutoAnalyseResultResponseNbOfCorrect1' : 'tutoAnalyseResultResponseNbOfCorrect';
            msg += "<br />" + sprintf.sprintf(getLocalStr(format), report.strictSameBlocks.length);
            if (report.partialSameBlocks.length) {
                format = (report.partialSameBlocks.length <= 1) ? 'tutoAnalyseResultResponseNbOfPartial1' : 'tutoAnalyseResultResponseNbOfPartial';
                msg += "<br />" + sprintf.sprintf(getLocalStr(format), report.partialSameBlocks.length);
            }
            displayAnalysisMessage(getLocalStr('tutoAnalyseResultTitle') + getLocalStr('tutoAnalyseResultIncomplete'), msg);
        }
        /**
         * Display a message in the modal analysis result message box
         * 
         * @param {string} title Title of the message
         * @param {mixed} body body of the message, Type: htmlString or Element or Text or Array or jQuery (see jQuery.append) 
         * 
         * @return {void} Nothing
         */
        function displayAnalysisMessage(title, body) {
            $('#tutorialAnalysisResult_title').text(title);
            $('#tutorialAnalysisResult_body').text('').append(body);
            $('#tutorialAnalysisResult').openModal();
        }
        /**
         * Shortcut to get local string
         * 
         * @param {string} id Identifier of the string
         * 
         * @return {string} Matched local string
         */
        function getLocalStr(id) {
            return ardublockly.getLocalStr(id);
        }
        /**
         * When going to next step
         * 
         * @return {void} Nothing
         */
        function next() {
            if (!_data || (stepIndex + 1) >= _data['steps'].length) {
                return;
            }
            stepIndex++;
            populateStep(_data['steps'][stepIndex]);
        }
        /**
         * Update step navigation buttons
         * 
         * @return {void} Nothing
         */
        function updateNavBts() {
            // limit right
            if (stepIndex + 1 >= _data['steps'].length) {
                $('#tutoButtonNext').addClass("grey disabled");
            } else {
                $('#tutoButtonNext').removeClass("grey disabled");
            }
            if (stepIndex <= 0) {
                $('#tutoButtonBack').addClass("grey disabled");
            } else {
                $('#tutoButtonBack').removeClass("grey disabled");
            }
        }
        /**
         * When going to previous step
         * 
         * @return {void} Nothing
         */
        function back() {
            if (!_data || stepIndex <= 0) {
                return;
            }
            stepIndex--;
            populateStep(_data['steps'][stepIndex]);
        }
        /**
         * Restore toolbox to original state
         * 
         * @return {void} Nothing
         */
        function restoreToolbox() {
            if (!_data || ardublockly.TOOLBOX_XML == toolboxXmlBackup) {
                return;
            }
            ardublockly.TOOLBOX_XML = toolboxXmlBackup;
            ardublockly.TOOLBAR_SHOWING_SIMPLE_ = !ardublockly.TOOLBAR_SHOWING_SIMPLE_;
            ardublockly.toogleToolboxSimple();
        }
        /**
         * Pause the runner, hide tutorial stuff
         * 
         * @return {void} Nothing
         */
        function pause() {
            paused = true;
            restoreToolbox();
            resetBlockHighlighting();
        }
        /**
         * Resume the runner, display tutorial stuff again
         * 
         * @return {void} Nothing
         */
        function resume() {
            if (!_data) {
                return;
            }
            paused = false;
            restrictToolbox();
            validateAuto();
        }

        // API
        return {
            init: init,
            validate: validate,
            next: next,
            back: back,
            pause: pause,
            resume: resume,
            close: close
        };
    });
})(this);