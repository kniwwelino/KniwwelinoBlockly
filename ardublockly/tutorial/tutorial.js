/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 * 
 * @fileoverview General javaScript for Arduino Tutorial.
 */
(function(w) {
    "use strict";
    w.define(
        ['helpers', 'sprintf', 'json!conf/config.json', 'jquery', 'runner', 'canvasloader', 'tutorials', 'introjs'],
        function(h, sprintf, conf, $, runner, waitingLooper, tutorialsModel, introjs) {
            const ardublockly = w.Ardublockly;
            let $list;
            const URL_PARAM_KEY_TUTO = 'tuto';
            let tutorials = null;
            let _tutoId = false;
            let doTutoIntro = true;
            /**
             * Entry point
             * 
             * @return {void} Nothing
             */
            function init() {

                $list = $("#tutorialMenuList");

                // build waiting loop
                let waitingLoop = new waitingLooper('waitingLoop');
                $('#waitingLoopModal').data("waitingLoop", waitingLoop);
                waitingLoop.setColor('#26a69a');
                waitingLoop.setShape('spiral');
                waitingLoop.setDiameter(100);
                waitingLoop.setDensity(50);
                waitingLoop.setRange(0.7);
                waitingLoop.setFPS(20);

                // is dev
                if (h.getUrlParameter('tutodev') !== false) {
                    h.log("@tutorial-dev");
                    // load dev conf
                    w.require(['json!conf/config.dev.json'], function(conf_dev) {
                        // update conf
                        $.extend(conf, conf_dev);
                        // remove unload msg
                        w.onbeforeunload = null;
                        // remove default popup
                        if (swal.getState().isOpen) {
                            swal.close();
                        } else {
                            w.setTimeout(function() { swal.close(); }, 1000);
                        }
                        // normal behavior
                        onConfReady();
                    });
                    return;
                }
                onConfReady();
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
             * When configuration is available
             * 
             * @return {void} Nothing
             */
            function onConfReady() {

                //bind menu click
                ardublockly.bindClick_('menu_tuto', onClickForMenu);

                // bind sidebar button
                ardublockly.bindClick_('expandTutoButton', ardublockly.toggleSidebarElement);

                // observe sidebar state
                observeSidebar();

                //bind tuto main buttons
                ardublockly.bindClick_('tutoButtonValidate', onClickTutoValidate);
                ardublockly.bindClick_('tutoButtonBack', onClickTutoBack);
                ardublockly.bindClick_('tutoButtonNext', onClickTutoNext);

                //preload list
                tutorialsModel.fetch().done(function() {
                    tutorials = tutorialsModel.getTutorials();
                    loadTutoPage();
                    tutorialsModel.fetchTutorialsBasics().done(function() {
                        onTutorialsBasics();
                    }).fail(function(msg) {
                        fatal(msg, getLocalStr('tutorialError'), getLocalStr('tutorialDataAccessError'));
                    });
                }).fail(function(msg) {
                    fatal(msg, getLocalStr('tutorialError'), getLocalStr('tutorialDataAccessError'));
                });

                //detect tuto shortcut
                findTutoInUrl();
            }
            /**
             * Sidebar observer
             * 
             * @return {void} Nothing
             */
            function observeSidebar() {
                let observer = new MutationObserver(function() {
                    if ($("#tutoSidebar").is(":visible")) {
                        runner.resume();
                    } else {
                        runner.pause();
                    }
                });
                let obsConf = {
                    attributes: true,
                };
                observer.observe($("#tutoSidebar").get(0), obsConf);
                observer.observe($("#sidebar").get(0), obsConf);
            }
            /**
             * When tutorial basics are available
             * 
             * @return {void} Nothing
             */
            function onTutorialsBasics() {
                // load them
                $list.empty();
                let urlBase = new URL(conf.tutorialSitemap);
                tutorials.forEach(function(tuto) {
                    // go absolute
                    let imageSrc = (new URL(tuto.imageSrc, urlBase)).href;
                    // create link to trigger tutorial based on tuto path
                    let url = new URL(w.location.href);
                    let params = new URLSearchParams(url.search);
                    params.set(URL_PARAM_KEY_TUTO, tuto.value._path.join('/'));
                    url.search = params.toString();
                    // add element to DOM
                    let item = $(sprintf.sprintf('<a href="%s"><div><img src="%s" /><h5>%s</h5></div></a>', url.href, imageSrc, tuto.title));
                    $list.append(item);
                    ardublockly.bindClick_(item.get(0), onTutoSelected);
                });
            }
            /**
             * Get mapping of an URL
             * 
             * @param {string} url     An URL for which a mapping could be available
             * 
             * @return {string} Mapped URL
             */
            function getMappedUrl(url) {
                let urlMappingKey = 'url-mapping';
                if (!(urlMappingKey in conf) || !(url in conf[urlMappingKey])) {
                    return url;
                }
                return conf[urlMappingKey][url];
            }
            /**
             * find the tutorial identifier from the address bar and load the related tutorials
             * 
             * @return {void} Nothing
             */
            function findTutoInUrl() {
                _tutoId = h.getUrlParameter(URL_PARAM_KEY_TUTO);
                if (_tutoId === false) {
                    return;
                }
                loadTutoPage();
            }
            /**
             * When tutorial is selected by the user
             * 
             * @param {Event} event     Event trigger by user selection
             * 
             * @return {void} Nothing
             */
            function onTutoSelected(evt) {
                // close menu
                $('#tutorialMenu').closeModal();
                $('#sidenav-overlay').click();

                // update url
                let targetUrl = $(evt.target).closest('a').attr('href');
                w.history.pushState("", "", targetUrl);
                findTutoInUrl();
            }
            /**
             * Start waiting animation
             * 
             * @return {void} Nothing
             */
            function startWaiting() {
                let $waitingLoop = $('#waitingLoopModal');
                $waitingLoop.data("waitingLoop").show();
                $waitingLoop.openModal({ dismissible: false });
            }
            /**
             * Stop waiting animation
             * 
             * @return {void} Nothing
             */
            function stopWaiting() {
                let $waitingLoop = $('#waitingLoopModal');
                $waitingLoop.data("waitingLoop").hide();
                $waitingLoop.closeModal();
            }
            /**
             * Load the tutorial model elements
             * 
             * @return {void} Nothing
             */
            function loadTutoPage() {
                if (!_tutoId) {
                    return;
                }
                startWaiting();
                runner.close();
                if (!tutorials) {
                    // currently loading model
                    return;
                }
                h.log('handle tuto %s', _tutoId);
                tutorialsModel.fetchTutoElements(_tutoId).done(function(tuto) {
                    onTutoPageLoaded(tuto);
                }).fail(function(msg) {
                    fatal(msg, getLocalStr('tutorialError'), getLocalStr('tutorialDataAccessError'));
                });
                return;
            }
            /**
             * When tutorial model elements are loaded
             * 
             * @param {Object} tuto     Tutorial object
             * 
             * @return {void} Nothing
             */
            function onTutoPageLoaded(tuto) {
                runner.init(tuto, onRunnerReady, fatal);
            }
            /**
             * When runner is ready i.e. tutorial loaded by the runner
             * 
             * @return {void} Nothing
             */
            function onRunnerReady() {
                $('#expandTutoButton').css('display', 'inline-block');
                ardublockly.sidebarShowElement($('#tutoSidebar').get(0));
                stopWaiting();
                if (doTutoIntro) {
                    startTutorialIntro();
                }
            }
            /**
             * Start the step by step tutorial introduction
             * 
             * @return {void} Nothing
             */
            function startTutorialIntro() {
                let stepCounter = 1;

                $('#tutoSidebar').attr("data-intro", getLocalStr("tutoIntroStepSidebar")).attr("data-position", "left").attr("data-step", stepCounter++);
                $('div.blocklyToolboxDiv').attr("data-intro", getLocalStr("tutoIntroStepToolbox")).attr("data-position", "right").attr("data-step", stepCounter++);
                $('#content_blocks').attr("data-intro", getLocalStr("tutoIntroStepWorkspace")).attr("data-position", "right").attr("data-step", stepCounter++);
                $('#tutoButtonValidate').attr("data-intro", getLocalStr("tutoIntroStepAnalysis")).attr("data-position", "left").attr("data-step", stepCounter++);

                introjs().setOptions({
                    doneLabel: getLocalStr('tutoIntroTooltipDone'),
                    prevLabel: '&larr; ' + getLocalStr('tutoIntroTooltipBack'),
                    nextLabel: getLocalStr('tutoIntroTooltipNext') + ' &rarr;',
                    skipLabel: getLocalStr('tutoIntroTooltipSkip')
                }).onafterchange(function() {
                    ardublockly.contentWidthToggle();
                }).start();

                doTutoIntro = false;
            }
            /**
             * when a fatal error occured
             * 
             * @param {string} log     The technical log
             * @param {string} errorMsgTitle     Log title for user
             * @param {string} errorMsg      Log message for user
             * @throws {Error} En error
             * 
             * @return {void} Nothing
             */
            function fatal(log, errorMsgTitle, errorMsg) {
                ardublockly.alertMessage(errorMsgTitle, errorMsg);
                close();
                throw new (h.CommonError)(log);
            }
            function onClickTutoValidate() {
                runner.validate();
            }
            function onClickTutoBack() {
                runner.back();
            }
            function onClickTutoNext() {
                runner.next();
            }
            /**
             * Close the tutorial module: clean-up
             * 
             * @return {void} Nothing
             */
            function close() {
                stopWaiting();
                runner.close();
            }
            /**
             * When the user ask for the tutorial list
             * 
             * @return {void} Nothing
             */
            function onClickForMenu() {
                if ($list instanceof $) {
                    $list.parent().scrollTop(0);
                    return;
                }
                loadList();
            }
            // API
            return {
                init: init,
                close: close
            };
        });
})(this);