/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"): http://www.apache.org/licenses/LICENSE-2.0
 * 
 * @fileoverview Bootstrap for Arduino Tutorial.
 */
(function(w) {
    "use strict";

    // do not use any dependency
    w.define([], function() {
        /**
         * Fix the jQuery presence in requirejs when it is already loaded
         * 
         * @return {void} Nothing
         */
        function fixRequireJQuery() {
            // register jQuery in requireJS (because already loaded)
            if (typeof w.jQuery === typeof function() {
            }) {
                w.define('jquery', function() {
                    return w.jQuery;
                });
            }
        }
        /**
         * Set requirejs config
         * 
         * @param {function()} callback Callback when config is set
         * 
         * @return {void} Nothing
         */
        function setRequireConfig(callback) {
            if (typeof w.jQuery !== typeof function() {
            }) {
                throw new Error('jQuery is missing');
            }
            let jsBaseUrl = "";
            let done = function(requireJsConf) {
                if ("shim" in requireJsConf) {
                    for ( let mod in requireJsConf["shim"]) {
                        if ("init" in requireJsConf["shim"][mod]) {
                            requireJsConf["shim"][mod]["init"] = new Function(requireJsConf["shim"][mod]["init"]);
                        }
                    }
                }
                requireJsConf.baseUrl = jsBaseUrl;
                w.require.config(requireJsConf);
                callback();
            };
            w.jQuery.getJSON(jsBaseUrl + 'conf/requirejs.json', done).fail(function() {
                throw new Error('Cannot fetch file' + this.url);
            });
        }
        /**
         * Entry point
         * 
         * @param {function()} callback Callback when requirejs is ready to be used
         * 
         * @return {void} Nothing
         */
        function init(callback) {
            fixRequireJQuery();
            setRequireConfig(callback);
        }
        // API
        return {
            init : init
        };
    });
})(this);