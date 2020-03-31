(function(w) {
    "use strict";
    w.define([ 'jquery' ], function($) {
        /**
         * helper for handling errors
         * 
         * @throws {Error}
         * @returns void
         */
        function CommonError() {
            if (typeof w.console.error !== typeof undefined) {
                w.console.error.apply(this, arguments);
            } else {
                log.apply(this, arguments);
            }
            throw new Error('Please check previous log to get further details');
        }

        /**
         * helper
         * 
         * @param object
         * @param property
         * @returns void
         * @throws {CommonError}
         *             if not a property
         */
        function assertIsPropertyOf(object, property) {
            assertIsTypeOf(object, {});
            if (typeof property === typeof {}) {
                property.forEach(function(element) {
                    assertIsPropertyOf(object, element);
                });
                return;
            }
            if (typeof object[property] === typeof undefined) {
                throw new CommonError('property not found in object', {
                    'property' : property,
                    'object' : object
                });
            }
        }

        /**
         * Check if object and reference are
         * 
         * @param object
         * @param reference
         * @returns
         * @throws {CommonError}
         *             if not the same type
         */
        function assertIsTypeOf(object, reference) {
            if (typeof object !== typeof reference) {
                throw new CommonError('not the same type', {
                    'object A' : object,
                    'type A' : typeof object
                }, {
                    'object B' : reference,
                    'type B' : typeof reference
                });
            }
        }

        function arrayFrom(iterable) {
            var args = [];
            for (var i = 0; i < iterable.length; i++) {
                args.push(iterable[i]);
            }
            return args;
        }

        function log() {
            w.console.log.apply(null, arguments);
        }

        function filterObjectByKeys(object, keys, keyCheck) {
            if (keyCheck) {
                assertIsPropertyOf(object, keys);
            }
            var newObject = {};
            keys.forEach(function(key) {
                newObject[key] = object[key];
            });
            return newObject;
        }
        /**
         * Get a URL parameter value
         * 
         * @param parameter
         *            Name of the parameter otherWindow Window to search in for
         *            URL parameter (optional)
         * @returns The paramater value or false if not found
         */
        function getUrlParameter(parameter, otherWindow) {
            var win = (typeof otherWindow !== typeof undefined) ? otherWindow : w;
            var pairs = getUrlParameters(win);
            if (pairs.hasOwnProperty(parameter)) {
                return (typeof pairs[parameter] === typeof undefined) ? true : pairs[parameter];
            }
            return false;
        }
        function getUrlParameters(otherWindow) {
            var win = (typeof otherWindow !== typeof undefined) ? otherWindow : w;
            var pairs = {};
            var paramsString = decodeURIComponent(win.location.search.substring(1)).split('&');
            for (var i = 0; i < paramsString.length; i++) {
                var pair = paramsString[i].split('=');
                pairs[pair[0]] = pair[1];
            }
            return pairs;
        }
        return {
            getUrlParameter : getUrlParameter,
            getUrlParameters : getUrlParameters,
            arrayFrom : arrayFrom,
            log : log,
            assertIsTypeOf : assertIsTypeOf,
            assertIsPropertyOf : assertIsPropertyOf,
            CommonError : CommonError,
            filterObjectByKeys : filterObjectByKeys
        };
    });

})(this);