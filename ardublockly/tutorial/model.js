/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"): http://www.apache.org/licenses/LICENSE-2.0
 * 
 * @fileoverview Tutorial model loader.
 */

(function(w) {
    "use strict";
    w.define(['helpers', 'sprintf', 'json!conf/config.json', 'jquery',
        'zlib_and_gzip'], function(h, sprintf, conf, $, zlib) {
            const ardublockly = w.Ardublockly;
            let tutorials = null;
            /**
             * Entry point for fetching data
             * 
             * @return {jQuery.Deferred} deferred object
             */
            function fetch() {
                addBinaryAjaxSupportToJquery();
                return fetchSitemap();
            }
            /**
             * Get tutorials data
             * 
             * @return {Object[]} List of tutorial objects
             */
            function getTutorials() {
                return tutorials;
            }
            /**
             * Add binary support to jQuery ajax calls
             * 
             * @return {void} Nothing
             */
            function addBinaryAjaxSupportToJquery() {
                $.ajaxTransport("+binary", function(options, _originalOptions, jqXHR) {
                    // check for conditions and support for blob / arraybuffer response type
                    if (window.FormData && ((options.dataType && (options.dataType == 'binary'))
                        || (options.data && ((window.ArrayBuffer && options.data instanceof ArrayBuffer)
                            || (window.Blob && options.data instanceof Blob))))) {
                        return {
                            // create new XMLHttpRequest
                            send: function(headers, callback) {
                                // setup all variables
                                let xhr = new XMLHttpRequest(),
                                    url = options.url,
                                    type = options.type,
                                    async = options.async || true,
                                    // blob or arraybuffer. Default is blob
                                    dataType = options.responseType || "blob",
                                    data = options.data || null,
                                    username = options.username || null,
                                    password = options.password || null;
                                xhr.addEventListener('load', function() {
                                    let data = {};
                                    data[options.dataType] = xhr.response;
                                    // make callback and send data
                                    callback(xhr.status, xhr.statusText, data, xhr.getAllResponseHeaders());
                                });
                                xhr.open(type, url, async, username, password);
                                // setup custom headers
                                for (let i in headers) {
                                    xhr.setRequestHeader(i, headers[i]);
                                }
                                xhr.responseType = dataType;
                                xhr.send(data);
                            },
                            abort: function() {
                                jqXHR.abort();
                            }
                        };
                    }
                });
            }
            /**
             * Fetch the dokuwiki sitemap
             * 
             * @return {jQuery.Deferred} Deferred object
             */
            function fetchSitemap() {
                let returnDeferred = $.Deferred();
                let done = function(data) {
                    onSitemapFetched(data, this, returnDeferred);
                };
                let fail = function() {
                    returnDeferred.reject(sprintf.sprintf('page loading failed: %s', this.url));
                };
                $.ajax({
                    type: "GET",
                    url: conf.tutorialSitemap,
                    dataType: 'binary',
                    processData: 'false',
                    responseType: 'arraybuffer',
                }).done(done).fail(fail);
                return returnDeferred;
            }
            /**
             * Parse the sitemap fetched
             * 
             * @param {ArrayBuffer} data Ajax response data that contains sitemap
             * @param {Object} ajaxCtx Ajax context/settings
             * @param {jQuery.Deferred} returnDeferred jQuery deferred that has to be resolved
             * 
             * @return {void} Nothing
             */
            function onSitemapFetched(data, ajaxCtx, returnDeferred) {
                let $sitemapXml = $((new TextDecoder()).decode((new zlib.Gunzip(new Uint8Array(data))).decompress()));
                let tree = {};
                // extract hierarchy
                $sitemapXml.find('loc').each(function(_i, el) {
                    let url = new URL($(el).text());
                    let path = url.pathname.substring(1).split('/');
                    let current = tree;
                    let localPath = [];
                    path.forEach(function(part) {
                        localPath.push(part);
                        if (!(part in current)) {
                            current[part] = { _path: localPath.slice() };
                        }
                        current = current[part];
                    });
                });
                // extract tutorials
                let path = [];
                // find dedicated namespace
                let namespacePart = ardublockly.LANG;
                if (!(namespacePart in tree)) {
                    namespacePart = 'en';
                    if (!(namespacePart in tree)) {
                        returnDeferred.reject(sprintf.sprintf('namespacePart not found: %s', namespacePart));
                        return;
                    }
                }
                path.push(namespacePart);
                tree = tree[namespacePart];
                namespacePart = 'tutorial';
                if (!(namespacePart in tree)) {
                    returnDeferred.reject(sprintf.sprintf('namespacePart not found: %s', namespacePart));
                    return;
                }
                path.push(namespacePart);
                tree = tree[namespacePart];
                // deal with tutorials in root
                collectTutorials(tree, path);
                returnDeferred.resolve();
            }
            /**
             * Parse the tutorial description
             * 
             * @param {string} data Ajax response data for a tutorial description
             * @param {Object} tuto The tutorial object to populate
             * @param {Object} ajaxCtx Ajax context/settings
             * @param {jQuery.Deferred} returnDeferred jQuery deferred in case of failure
             * 
             * @return {void} Nothing
             */
            function onTutorialDescription(data, tuto, ajaxCtx, returnDeferred) {
                // register url
                tuto.url = ajaxCtx.url;
                // exclude not found
                let $htmlDom = $(new DOMParser().parseFromString(data, 'text/html'));
                if ($htmlDom.find('#this_topic_does_not_exist_yet').length) {
                    returnDeferred.reject(sprintf.sprintf('page not found: %s', ajaxCtx.url));
                    return;
                }
                // register html
                tuto.$html = $htmlDom;
                // get title
                let $headings = $htmlDom.find(':header');
                if (!$headings.length) {
                    returnDeferred.reject(sprintf.sprintf('no title found for: %s', ajaxCtx.url));
                    return;
                }
                tuto.title = $headings.first().text();
                if (!tuto.title) {
                    returnDeferred.reject(sprintf.sprintf('no title found for: %s', ajaxCtx.url));
                    return;
                }
                // get image
                let $images = $htmlDom.find('img[src]');
                if (!$images.length) {
                    returnDeferred.reject(sprintf.sprintf('no image found for: %s', ajaxCtx.url));
                    return;
                }
                tuto.imageSrc = $images.first().attr('src');
            }
            /**
             * Get the tutorial description as deferred object
             * 
             * @param {Object} tuto The tutorial object to populate
             * @param {jQuery.Deferred} returnDeferred jQuery deferred in case of failure
             * 
             * @return {jqXHR} jQuery Ajax deferred object (super set of XMLHTTPRequest)
             */
            function getDeferredDescription(tuto, returnDeferred) {
                let done = function(data) {
                    onTutorialDescription(data, tuto, this, returnDeferred);
                };
                let descriptionDeferred = $.ajax({
                    type: "GET",
                    url: buildTutoUrl(tuto['value']['_path']) + 'description?do=export_html',
                    dataType: 'html',
                    headers: {
                        Accept: "text/html"
                    }
                }).done(done);
                if (!tuto.deferred) {
                    tuto.deferred = {};
                }
                tuto.deferred['description'] = descriptionDeferred;
                return descriptionDeferred;
            }
            /**
             * Build a tutorial URL
             * 
             * @param {string[]} pathArray Splitted relative path of a tutorial
             * 
             * @return {string} the absolute path to the URL
             */
            function buildTutoUrl(pathArray) {
                let url = new URL(conf.tutorialSitemap);
                url = url.origin + url.pathname + pathArray.join('/') + '/';
                return url;
            }
            /**
             * Fetch basic information of all tutorials
             * 
             * @return {jQuery.Deferred} A jQuery deferred object
             */
            function fetchTutorialsBasics() {
                let returnDeferred = $.Deferred();
                // get description page for title and image
                let deferred = [];
                tutorials.forEach(function(tuto) {
                    deferred.push(getDeferredDescription(tuto, returnDeferred));
                });
                let done = function() {
                    returnDeferred.resolve();
                };
                let fail = function() {
                    returnDeferred.reject(sprintf.sprintf('loading failed: %s', this.url));
                };
                $.when.apply($, deferred).then(done, fail);
                return returnDeferred;
            }
            /**
             * get all steps from a sitemap tutorial
             * 
             * @param {Object} where Object to parse
             * 
             * @return Object[]} Found Steps
             */
            function getSteps(where) {
                let steps = [];
                let regex = /^\s*step\s*0*(\d+)\s*$/i;
                let stepCounter = 1;
                for (let key in where) {
                    let match = key.match(regex);
                    if (!match) {
                        continue;
                    }
                    let step = where[key];
                    let solutions = getSolutions(step);
                    if (!('description' in step) || !solutions.length) {
                        h.log('no step description or no solutions');
                        continue;
                    }
                    steps.push({
                        nb: stepCounter++,
                        number: match[1],
                        solutions: solutions,
                        value: where[key]
                    });

                }
                return steps;
            }
            /**
             * get all solutions from a sitemap tutorial step
             * 
             * @param {Object} step Object to parse
             * 
             * @return {Object[]} Found Solutions
             */
            function getSolutions(step) {
                let regex = /^\s*solution\s*0*(\d+)*\s*$/i;
                let solutions = [];
                for (let key in step) {
                    if (!regex.test(key)) {
                        continue;
                    }
                    solutions.push(key);
                }
                return solutions;
            }
            /**
             * get level from a sitemap tutorial
             * 
             * @param {Object} where Object to parse
             * 
             * @return {number} level; default: 0
             */
            function getTutoLevel(where) {
                let regex = /^\s*level\s*0*(\d+)\s*$/i;
                for (let key in where) {
                    let match = key.match(regex);
                    if (match) {
                        return match[1];
                    }
                }
                return 0;
            }
            /**
             * collect all tutorials from sitemap
             * 
             * @param {Object} where Object to parse
             * @param {string[]} root Path to the tutorials root
             * 
             * @return {void} Nothing
             */
            function collectTutorials(where, root) {
                tutorials = [];
                let regex = /^\s*tutorial\s*0*(\d+)\s*$/i;
                for (let key in where) {
                    let match = key.match(regex);
                    if (!match) {
                        continue;
                    }
                    let tuto = where[key];
                    if (!('description' in tuto)) {
                        h.log('no description');
                        continue;
                    }
                    // collect steps
                    let steps = getSteps(tuto);
                    if (!steps.length) {
                        h.log('no step');
                        continue;
                    }
                    // clone the original path
                    let tutoPath = root.slice();
                    // create path
                    tutoPath.push(key);
                    tutorials.push({
                        number: match[1],
                        level: getTutoLevel(tuto),
                        steps: steps,
                        value: where[key]
                    });
                }
            }
            /**
             * parse the step description
             * 
             * @param {string} data Ajax response data: step description
             * @param {Object} step Step Object to populate
             * @param {Object} ajaxCtx Ajax context/settings
             * @param {jQuery.Deferred} returnDeferred jQuery deferred in case of failure
             * 
             * @return {void} Nothing
             */
            function onStepDescription(data, step, ajaxCtx, returnDeferred) {
                // register url
                step.url = ajaxCtx.url;
                // exclude not found
                let $htmlDom = $(new DOMParser().parseFromString(data, 'text/html'));
                if ($htmlDom.find('#this_topic_does_not_exist_yet').length) {
                    returnDeferred.reject(sprintf.sprintf('page not found: %s', ajaxCtx.url));
                    return;
                }
                // register html
                step.$html = $htmlDom;
            }
            /**
             * parse the solution
             * 
             * @param {string} data Ajax response data: a XML solution
             * @param {Object} step Step Object to populate
             * @param {Object} ajaxCtx Ajax context/settings
             * @param {jQuery.Deferred} returnDeferred jQuery deferred in case of failure
             * 
             * @return {void} Nothing
             */
            function onSolution(data, step, ajaxCtx, returnDeferred) {
                if (!data) {
                    returnDeferred.reject(sprintf.sprintf('empty solution: %s', ajaxCtx.url));
                    return;
                }
                let solutionKey = 'solutionsXml';
                if (!(solutionKey in step)) {
                    step[solutionKey] = [];
                }
                // validate
                if (new DOMParser().parseFromString(data, 'text/xml').documentElement.nodeName == "parsererror") {
                    returnDeferred.reject(sprintf.sprintf('invalid xml: %s', ajaxCtx.url));
                    return;
                }
                step[solutionKey].push(data);
            }
            /**
             * Fetch tutorial elements
             * 
             * @param {string} tutoId Tutorial identifier: relative path to the tutorial in dokuwiki
             * 
             * @return {jQuery.Deferred} returnDeferred a jQuery deferred object
             */
            function fetchTutoElements(tutoId) {
                let returnDeferred = $.Deferred();
                // get tuto
                let tuto = tutorials.find(t => (t.value._path.join('/') == tutoId));
                if (!tuto) {
                    returnDeferred.reject(sprintf.sprintf('tuto not found: %s', tutoId));
                    return;
                }
                // load all related elements
                let deferreds = [];
                // description
                let deferred = null;
                if (('deferred' in tuto) && ('description' in tuto['deferred'])) {
                    deferred = tuto['deferred']['description'];
                } else {
                    deferred = getDeferredDescription(tuto, returnDeferred);
                }
                deferreds.push(deferred);
                // get steps
                tuto.steps.forEach(function(step) {
                    let stepUrl = new URL(buildTutoUrl(step['value']['_path']));
                    // get description
                    let url = stepUrl + 'description?do=export_html';
                    let done = function(data) {
                        onStepDescription(data, step, this, returnDeferred);
                    };
                    deferreds.push($.ajax({
                        type: "GET",
                        url: url,
                        dataType: 'html',
                        headers: {
                            Accept: "text/html"
                        }
                    }).done(done));
                    // get solutions
                    step.solutions.forEach(function(solution) {
                        url = stepUrl + solution + '?do=export_raw';
                        done = function(data, _msg, jqXhr) {
                            if (jqXhr.getResponseHeader("content-type").indexOf('html') != -1) {
                                returnDeferred.reject(sprintf.sprintf('loading failed: %s', this.url));
                                return;
                            };
                            onSolution(data, step, this, returnDeferred);
                        };
                        deferreds.push($.ajax({
                            type: "GET",
                            url: url,
                            dataType: 'text',
                            headers: {
                                Accept: "text/plain"
                            }
                        }).done(done));
                    });
                });
                let done = function() {
                    onTutoElementsFetched(tuto, returnDeferred);
                };
                let fail = function() {
                    returnDeferred.reject(sprintf.sprintf('loading failed: %s', this.url));
                };
                $.when.apply($, deferreds).then(done, fail);
                return returnDeferred;
            }
            /**
             * when tutorial elements are fetched correctly: preload images
             * 
             * @param {Objet} tuto Step Object to populate
             * @param {jQuery.Deferred} returnDeferred jQuery deferred object to resolve
             * 
             * @return {void} Nothing
             */
            function onTutoElementsFetched(tuto, returnDeferred) {
                let deferreds = [];
                // preload images
                tuto.steps.forEach(function(step) {
                    step.$html.find("img[src]").each(function() {
                        let imgDeferred = $.Deferred();
                        let $img = $('<img />');
                        $img.on("load", () => imgDeferred.resolve()).error(e => imgDeferred.reject($(e.currentTarget).attr("src")));
                        $img.attr('src', conf.tutorialUrlEnforcement + $(this).attr('src'));
                        if (step.nb == 1) {
                            deferreds.push(imgDeferred);
                        }
                    });
                });
                let done = function() {
                    returnDeferred.resolve(tuto);
                };
                let fail = function(msg) {
                    returnDeferred.reject(sprintf.sprintf('preloading images failed: %s', msg));
                };
                $.when.apply($, deferreds).then(done, fail);
            }
            // API
            return {
                fetch: fetch,
                fetchTutorialsBasics: fetchTutorialsBasics,
                getTutorials: getTutorials,
                fetchTutoElements: fetchTutoElements
            };
        });
})(this);