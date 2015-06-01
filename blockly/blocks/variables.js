/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Variable blocks for Blockly.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Blocks.variables');

goog.require('Blockly.Blocks');
goog.require('Blockly.StaticTyping');


Blockly.Blocks.variables.HUE = 330;

Blockly.Blocks['variables_get'] = {
  /**
   * Block for variable getter.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.VARIABLES_GET_HELPURL);
    this.setColour(Blockly.Blocks.variables.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.VARIABLES_GET_TITLE)
        .appendField(new Blockly.FieldVariable(
        Blockly.Msg.VARIABLES_GET_ITEM), 'VAR')
        .appendField(Blockly.Msg.VARIABLES_GET_TAIL);
    this.setOutput(true);
    this.setTooltip(Blockly.Msg.VARIABLES_GET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_GET_CREATE_SET;
    this.contextMenuType_ = 'variables_set';
  },
  /**
   * Return all variables referenced by this block.
   * @return {!Array.<string>} List of variable names.
   * @this Blockly.Block
   */
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  /**
   * Notification that a variable is renaming.
   * If the name matches one of this block's variables, rename it.
   * @param {string} oldName Previous name of variable.
   * @param {string} newName Renamed variable.
   * @this Blockly.Block
   */
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setFieldValue(newName, 'VAR');
    }
  },
  /**
   * Add menu option to create getter/setter block for this setter/getter.
   * @param {!Array} options List of menu options to add to.
   * @this Blockly.Block
   */
  customContextMenu: function(options) {
    var option = {enabled: true};
    var name = this.getFieldValue('VAR');
    option.text = this.contextMenuMsg_.replace('%1', name);
    var xmlField = goog.dom.createDom('field', null, name);
    xmlField.setAttribute('name', 'VAR');
    var xmlBlock = goog.dom.createDom('block', null, xmlField);
    xmlBlock.setAttribute('type', this.contextMenuType_);
    option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
    options.push(option);
  },
  /**
   * Finds the type of the selected variable.
   * @this Blockly.Block
   * @param {Array<string>} existingVars Associative array of variables already
   *                                     defined. Var names as key and type as
   *                                     value.
   * @return {string} String to indicate the type if it has not been defined
   *                  before.
   */
  getVarType: function(existingVars) {
    var varName = this.getFieldValue('VAR');

    // Check if variable has been defined already add if it has been.
    var varType = Blockly.StaticTyping.findListVarType(varName, existingVars);
    if (varType != null) {
      this.varType = varType;
      this.setWarningText(null);
    } else {
      // This block needs the variable to be define before use, so warn user.
      this.setWarningText('This variable needs to be set to something before' +
                          ' it can be used!');
    }

    return varType;
  },
  /**
   * Contains the type of the variable selected from the first set block.
   */
  varType: Blockly.StaticTyping.blocklyType.UNDEF,
  /**
   * Retrieves the type of the selected variable, defined at getVarType.
   * @this Blockly.Block
   */
  getType: function() {
    return this.varType;
  }
};

Blockly.Blocks['variables_set'] = {
  /**
   * Block for variable setter.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.VARIABLES_SET_HELPURL);
    this.setColour(Blockly.Blocks.variables.HUE);
    this.interpolateMsg(
        // TODO: Combine these messages instead of using concatenation.
        Blockly.Msg.VARIABLES_SET_TITLE + ' %1 ' +
        Blockly.Msg.VARIABLES_SET_TAIL + ' %2',
        ['VAR', new Blockly.FieldVariable(Blockly.Msg.VARIABLES_SET_ITEM)],
        ['VALUE', null, Blockly.ALIGN_RIGHT],
        Blockly.ALIGN_RIGHT);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
    this.contextMenuType_ = 'variables_get';
  },
  /**
   * Return all variables referenced by this block.
   * @return {!Array.<string>} List of variable names.
   * @this Blockly.Block
   */
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  /**
   * Notification that a variable is renaming.
   * If the name matches one of this block's variables, rename it.
   * @param {string} oldName Previous name of variable.
   * @param {string} newName Renamed variable.
   * @this Blockly.Block
   */
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setFieldValue(newName, 'VAR');
    }
  },
  customContextMenu: Blockly.Blocks['variables_get'].customContextMenu,
  /**
   * Searches through the nested blocks to find a variable type.
   * @this Blockly.Block
   * @param {Array<string>} existingVars Associative array of variables already
   *                                     defined. Var name as the key, type as
   *                                     the value.
   * @return {string} String to indicate the type if it has not been defined
   *                  before.
   */
  getVarType: function(existingVars) {
    var varName = this.getFieldValue('VAR');

    // Check what this block type should be
    var thisBlockType = Blockly.StaticTyping.getChildBlockType(this);

    // Check if variable has been defined already
    var varType = Blockly.StaticTyping.findListVarType(varName, existingVars);
    if (varType === null) {
      // This block var has not been encountered before, so return type
      this.setWarningText(null);
      return thisBlockType;
    } else if ((existingVars[varName] !== thisBlockType) &&
               (this.getChildren().length > 0)) {
      // Variable name defined before, but only set warning if there are child
      // blocks 
      this.setWarningText('This block is using a different type than what ' +
          'was set on the first use of this variable.\nFirst use type: ' +
          existingVars[varName] + '\nThis block type: ' + thisBlockType);
      return null;
    } else {
      // Variable defined before, but it is the same type, or block is empty
      this.setWarningText(null);
      return null;
    }
  }
};