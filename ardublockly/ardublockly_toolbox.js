/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview XML toolbox embedded into a JavaScript text string.
 */
'use strict';

/** Create a namespace for the application. */
var Ardublockly = Ardublockly || {};

Ardublockly.TOOLBOX_XML = '';
Ardublockly.toolbox_helpers = Ardublockly.toolbox_helpers || {};
Ardublockly.toolbox_helpers.CUSTOM_ID__SEPARATOR = "__";
Ardublockly.toolbox_helpers.TOOLBOX_LOADED_MSG_ID = "toolbox_loaded";
Ardublockly.toolbox_helpers.addCustomIds = function(w) {
    let onXml = function(data) {
        let xmlSerializer = new w.XMLSerializer();
        // set ids to reflect categories
        let $dom = $(xmlSerializer.serializeToString(data.documentElement));
        $dom.find("category").each((_i, cat) => {
            let $cat = $(cat);
            let catId = $cat.attr('id');
            $cat.find("block").each((_i, bl) => {
                $(bl).attr("id", catId + Ardublockly.toolbox_helpers.CUSTOM_ID__SEPARATOR + Blockly.genUid())
            });
        });
        Ardublockly.TOOLBOX_XML = xmlSerializer.serializeToString($dom.get(0));
        w.postMessage(Ardublockly.toolbox_helpers.TOOLBOX_LOADED_MSG_ID, "*");
        $(document).trigger("toolbox_loaded");
    };
    let onXmlFailed = function() {
        console.log(arguments);
    };
    $.get("toolbox.xml").done(onXml).fail(onXmlFailed);
};
Ardublockly.toolbox_helpers.getCustomId = function(id) {
    let regex = /^(.*)__(.*)$/;
    let match = id.match(regex);
    if (!match) {
        return null;
    }
    return { custom: match[1], id: match[2] };
};
// init
Ardublockly.toolbox_helpers.addCustomIds(window);
