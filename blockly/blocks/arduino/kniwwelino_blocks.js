/**
 * @license Copyright (C) 2017 Luxembourg Institute of Science and Technology.
 * KinwwelinoBlockly is Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Blocks for for the Kniwwelino Library.
 * Kniwwelino library docs: https://kniwwelino.github.io/en/reference/
 */
'use strict';

goog.provide('Blockly.Blocks.kniwwelino_Kniwwelino');
goog.provide('Blockly.Blocks.kniwwelino_RGB');
goog.provide('Blockly.Blocks.kniwwelino_MATRIX');
goog.provide('Blockly.Blocks.kniwwelino_BUTTONS');
goog.provide('Blockly.Blocks.kniwwelino_MQTT');
goog.provide('Blockly.Blocks.kniwwelino_SENSOR');
goog.provide('Blockly.Blocks.kniwwelino_AUDIO');

goog.require('Blockly.Blocks');
goog.require('Blockly.Types');

/** Common HSV hue for all blocks in this category. */
Blockly.Blocks.kniwwelino_Kniwwelino.HUE = "#ee4035";
Blockly.Blocks.kniwwelino_RGB.HUE = "#30499b";
Blockly.Blocks.kniwwelino_MATRIX.HUE = "#844d9e";
Blockly.Blocks.kniwwelino_BUTTONS.HUE = "#88c542";
Blockly.Blocks.kniwwelino_MQTT.HUE = "#f3a530";
Blockly.Blocks.kniwwelino_SENSOR.HUE = "#4b709a";
Blockly.Blocks.kniwwelino_AUDIO.HUE = "#a577bb";

//==== Kniwwelino functions===================================================

Blockly.Blocks['kniwwelino_getID'] = {
		  init: function() {
		    this.appendDummyInput()
		    	.appendField(Blockly.Msg.KNIWWELINO_GETID);
		    this.setOutput(true, Blockly.Types.TEXT.output);
		    this.setTooltip(Blockly.Msg.KNIWWELINO_GETID_TIP);
		    this.setColour(Blockly.Blocks.kniwwelino_Kniwwelino.HUE);
		    this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'kniwwelino');
		  },getBlockType: function() {
			    return Blockly.Types.TEXT;
		  }
};

Blockly.Blocks['kniwwelino_getName'] = {
		  init: function() {
		    this.appendDummyInput()
		    	.appendField(Blockly.Msg.KNIWWELINO_GETNAME);
		    this.setOutput(true, Blockly.Types.TEXT.output);
		    this.setTooltip(Blockly.Msg.KNIWWELINO_GETNAME_TIP);
		    this.setColour(Blockly.Blocks.kniwwelino_Kniwwelino.HUE);
		    this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'kniwwelino');
		  },getBlockType: function() {
			    return Blockly.Types.TEXT;
		  }
};

Blockly.Blocks['kniwwelino_getIP'] = {
		  init: function() {
		    this.appendDummyInput()
		    	.appendField(Blockly.Msg.KNIWWELINO_GETIP);
		    this.setOutput(true, Blockly.Types.TEXT.output);
		    this.setTooltip(Blockly.Msg.KNIWWELINO_GETIP_TIP);
		    this.setColour(Blockly.Blocks.kniwwelino_Kniwwelino.HUE);
		    this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'kniwwelino');
		  },getBlockType: function() {
			    return Blockly.Types.TEXT;
		  }
};

Blockly.Blocks['kniwwelino_getMAC'] = {
		  init: function() {
		    this.appendDummyInput()
		    	.appendField(Blockly.Msg.KNIWWELINO_GETMAC);
		    this.setOutput(true, Blockly.Types.TEXT.output);
		    this.setTooltip(Blockly.Msg.KNIWWELINO_GETMAC_TIP);
		    this.setColour(Blockly.Blocks.kniwwelino_Kniwwelino.HUE);
		    this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'kniwwelino');
		  }
};

Blockly.Blocks['kniwwelino_sleepsec'] = {
		init: function() {
		    this.appendValueInput('DELAY_TIME_SEC')
		        .setCheck(Blockly.Types.NUMBER.checkList)
		        .appendField(Blockly.Msg.ARD_TIME_DELAY);
		    this.appendDummyInput()
		        .appendField(Blockly.Msg.KNIWWELINO_TIME_SEC);
		    this.setInputsInline(true);
		    this.setPreviousStatement(true, null);
		    this.setNextStatement(true, null);
		    this.setColour("#f9d831");
		    this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'time');
		  }
};

Blockly.Blocks['kniwwelino_sleep'] = {
		init: function() {
		    this.appendValueInput('DELAY_TIME_MILI')
		        .setCheck(Blockly.Types.NUMBER.checkList)
		        .appendField(Blockly.Msg.ARD_TIME_DELAY);
		    this.appendDummyInput()
		        .appendField(Blockly.Msg.ARD_TIME_MS);
		    this.setInputsInline(true);
		    this.setPreviousStatement(true, null);
		    this.setNextStatement(true, null);
		    this.setColour("#f9d831");
		    this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'time');
		  }
};

Blockly.Blocks['kniwwelino_getTime'] = {
		  init: function() {
			  this.appendDummyInput()
			    .appendField(Blockly.Msg.KNIWWELINO_GET_TIME)
			    .appendField(new Blockly.FieldDropdown(
			    [
			    	[Blockly.Msg.KNIWWELINO_TIME_DATETIME,"DATETIME"],
			    	[Blockly.Msg.KNIWWELINO_TIME_DATE,"DATE"],
			    	[Blockly.Msg.KNIWWELINO_TIME_TIME,"TIME"],
			    	[Blockly.Msg.KNIWWELINO_TIME_HOUR,"HOUR"],
			    	[Blockly.Msg.KNIWWELINO_TIME_MINUTE,"MINUTE"],
			    	[Blockly.Msg.KNIWWELINO_TIME_SECOND,"SECOND"]
			    ]), "FORMAT");
		    this.setOutput(true, Blockly.Types.TEXT.output);
		    this.setTooltip(Blockly.Msg.KNIWWELINO_GET_TIME);
		    this.setColour("#f9d831");
		    this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'time');
		  },getBlockType: function() {
			    return Blockly.Types.TEXT;
		  }
};

Blockly.Blocks['kniwwelino_log'] = {
		   init: function() {
				 this.setInputsInline(true);
			     this.appendValueInput("TEXT")
			         .appendField(Blockly.Msg.KNIWWELINO_LOG);
			     this.setPreviousStatement(true, null);
			     this.setNextStatement(true, null);
			     this.setColour(Blockly.Blocks.kniwwelino_Kniwwelino.HUE);
			     this.setTooltip(Blockly.Msg.KNIWWELINO_LOG_TIP);
			     this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'kniwwelino');
			   }
			};

Blockly.Blocks['kniwwelino_logln'] = {
		   init: function() {
				 this.setInputsInline(true);
			     this.appendValueInput("TEXT")
			         .appendField(Blockly.Msg.KNIWWELINO_LOG_LINE);
			     this.setPreviousStatement(true, null);
			     this.setNextStatement(true, null);
			     this.setColour(Blockly.Blocks.kniwwelino_Kniwwelino.HUE);
			     this.setTooltip(Blockly.Msg.KNIWWELINO_LOG_TIP);
			     this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'kniwwelino');
			   }
			};

//==== RGB LED  functions ====================================================
//void RGBsetColor(uint32 color);
//void RGBsetColorEffect(uint32 color, uint8_t effect, int count);
//void RGBsetColorEffect(uint8_t red ,uint8_t green, uint8_t blue, uint8_t effect, int count);

Blockly.Blocks['kniwwelino_RGBselectColor'] = {
		   init: function() {
		     this.appendDummyInput()
		         .appendField(Blockly.Msg.KNIWWELINO_RGB_SELECTCOLOR)
		         .appendField(new Blockly.FieldColour("#00FF00"), "COLOR");
		     this.setOutput(true, Blockly.Types.TEXT.output);
		     this.setColour(Blockly.Blocks.kniwwelino_RGB.HUE);
		     this.setTooltip(Blockly.Msg.KNIWWELINO_RGB_SELECTCOLOR_TIP);
		     this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'led');
		   },getBlockType: function() {
			    return Blockly.Types.TEXT;
		   }
		};

Blockly.Blocks['kniwwelino_RGBsetRGB'] = {
		  init: function() {
		    this.appendValueInput("RED")
		        .setCheck("Number")
		        .appendField(Blockly.Msg.KNIWWELINO_RGB_RED);
		    this.appendValueInput("GREEN")
		        .setCheck("Number")
		        .appendField(Blockly.Msg.KNIWWELINO_RGB_GREEN);
		    this.appendValueInput("BLUE")
		        .setCheck("Number")
		        .appendField(Blockly.Msg.KNIWWELINO_RGB_BLUE);
		    this.appendDummyInput();
				this.setOutput(true, Blockly.Types.TEXT.output);
				this.setColour(Blockly.Blocks.kniwwelino_RGB.HUE);
	 		  this.setTooltip(Blockly.Msg.KNIWWELINO_RGB_TIP);
	 		  this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'led');
		  }, getBlockType: function() {
				 return Blockly.Types.TEXT;
			}, onchange: function(ev) {
		    var r = Blockly.Arduino.valueToCode(this, 'RED', Blockly.Arduino.ORDER_ATOMIC);
				var g = Blockly.Arduino.valueToCode(this, 'GREEN', Blockly.Arduino.ORDER_ATOMIC);
				var b = Blockly.Arduino.valueToCode(this, 'BLUE', Blockly.Arduino.ORDER_ATOMIC);
				if (r < 0 || r > 255) {
				  swal({
						title: Blockly.Msg.KNIWWELINO_WARNING,
						text: Blockly.Msg.KNIWWELINO_RGB_SETRGB_WARNING,
						className: "kniwwelino-bg"
					});
		    } else if (g < 0 || g > 255) {
					swal({
						title: Blockly.Msg.KNIWWELINO_WARNING,
						text: Blockly.Msg.KNIWWELINO_RGB_SETRGB_WARNING,
						className: "kniwwelino-bg"
					});
		    } else if (b < 0 || b > 255) {
					swal({
						title: Blockly.Msg.KNIWWELINO_WARNING,
						text: Blockly.Msg.KNIWWELINO_RGB_SETRGB_WARNING,
						className: "kniwwelino-bg"
					});
		    }
		  }
		};

Blockly.Blocks['kniwwelino_RGBsetColorEffect'] = {
		  init: function() {
			this.setInputsInline(true);
			this.appendValueInput("COLOR")
			         .appendField(Blockly.Msg.KNIWWELINO_RGB_SETCOLORFROMSTRING)
				     .setCheck(Blockly.Types.TEXT.checkList)
		    this.appendDummyInput()
		        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.KNIWWELINO_PIN_ON,"RGB_ON"], [Blockly.Msg.KNIWWELINO_PIN_EFFECT_BLINK,"RGB_BLINK"], [Blockly.Msg.KNIWWELINO_PIN_EFFECT_FLASH,"RGB_FLASH"]]), "EFFECT");
		    this.setPreviousStatement(true, null);
		    this.setNextStatement(true, null);
		    this.setColour(Blockly.Blocks.kniwwelino_RGB.HUE);
			this.setTooltip(Blockly.Msg.KNIWWELINO_RGB_SETCOLOREFFECT_TIP);
			this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'led');
		  }
		};

Blockly.Blocks['kniwwelino_RGBsetEffect'] = {
		  init: function() {
			this.setInputsInline(true);
		    this.appendDummyInput()
		    	.appendField(Blockly.Msg.KNIWWELINO_RGB_SETEFFECT)
		        .appendField(new Blockly.FieldDropdown([[Blockly.Msg.KNIWWELINO_PIN_ON,"RGB_ON"], [Blockly.Msg.KNIWWELINO_PIN_EFFECT_BLINK,"RGB_BLINK"], [Blockly.Msg.KNIWWELINO_PIN_EFFECT_FLASH,"RGB_FLASH"]]), "EFFECT");
		    this.setPreviousStatement(true, null);
		    this.setNextStatement(true, null);
		    this.setColour(Blockly.Blocks.kniwwelino_RGB.HUE);
			this.setTooltip(Blockly.Msg.KNIWWELINO_RGB_SETEFFECT_TIP);
			this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'led');
		  }
		};

Blockly.Blocks['kniwwelino_RGBsetColorFromString'] = {
		   init: function() {
			 this.setInputsInline(true);
		     this.appendValueInput("COLOR")
		         .appendField(Blockly.Msg.KNIWWELINO_RGB_SETCOLORFROMSTRING)
			     .setCheck(Blockly.Types.TEXT.checkList);
		     this.setPreviousStatement(true, null);
		     this.setNextStatement(true, null);
		     this.setColour(Blockly.Blocks.kniwwelino_RGB.HUE);
		     this.setTooltip(Blockly.Msg.KNIWWELINO_RGB_SETCOLORFROMSTRING_TIP);
		     this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'led');
		   }
		};

Blockly.Blocks['kniwwelino_RGBsetBrightness'] = {
		   init: function() {
		     this.appendDummyInput()
		         .appendField(Blockly.Msg.KNIWWELINO_RGB_SETBRIGHTNESS)
		         .appendField(new Blockly.FieldNumber(200, 0, 255, 0), 'BRIGHTNESS');
		     this.setPreviousStatement(true, null);
		     this.setNextStatement(true, null);
		     this.setColour(Blockly.Blocks.kniwwelino_RGB.HUE);
		     this.setTooltip(Blockly.Msg.KNIWWELINO_RGB_SETBRIGHTNESS_TIP);
		     this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'led');
		   },

		   onchange: function() {
		     if (this.getFieldValue('BRIGHTNESS') < 1 | this.getFieldValue('BRIGHTNESS') > 255) {
		       this.setWarningText(Blockly.Msg.KNIWWELINO_MATRIX_SETBRIGHTNESS_ALERT);
		       if (this.getFieldValue('BRIGHTNESS') < 1) {
		         this.setFieldValue(1, 'BRIGHTNESS');
		       } else if (this.getFieldValue('BRIGHTNESS') > 255) {
		         this.setFieldValue(255, 'BRIGHTNESS');
		       }
		     } else {
		       this.setWarningText(null);
		     }
		   }

		};


Blockly.Blocks['kniwwelino_RGBsetBrightnessFromVariable'] = {
		   init: function() {
			 this.setInputsInline(true);
				 this.appendValueInput("BRIGHTNESS").setCheck(Blockly.Types.NUMBER.checkList).appendField(Blockly.Msg.KNIWWELINO_RGB_SETBRIGHTNESS)
		     this.setPreviousStatement(true, null);
		     this.setNextStatement(true, null);
		     this.setColour(Blockly.Blocks.kniwwelino_RGB.HUE);
		     this.setTooltip(Blockly.Msg.KNIWWELINO_RGB_SETBRIGHTNESS_TIP);
		     this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'led');
		   }
		};

Blockly.Blocks['kniwwelino_RGBclear'] = {
		   init: function() {
		     this.appendDummyInput()
		     	.appendField(Blockly.Msg.KNIWWELINO_RGB_CLEAR);
		     this.setPreviousStatement(true, null);
		     this.setNextStatement(true, null);
		     this.setColour(Blockly.Blocks.kniwwelino_RGB.HUE);
		     this.setTooltip(Blockly.Msg.KNIWWELINO_RGB_CLEAR_TIP);
		     this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'led');
		   }
		};

Blockly.Blocks['kniwwelino_PINsetEffect'] = {
		  init: function() {
		    this.appendDummyInput()
		    	.appendField(Blockly.Msg.KNIWWELINO_PIN_EFFECT)
		    	.appendField(new Blockly.FieldDropdown(Blockly.Arduino.Boards.selected.digitalPins), 'PIN')
		    	.appendField(Blockly.Msg.ARD_WRITE_TO)
		      .appendField(new Blockly.FieldDropdown([[Blockly.Msg.KNIWWELINO_PIN_ON,"PIN_ON"], [Blockly.Msg.KNIWWELINO_PIN_EFFECT_BLINK,"PIN_BLINK"], [Blockly.Msg.KNIWWELINO_PIN_EFFECT_FLASH,"PIN_FLASH"], [Blockly.Msg.KNIWWELINO_PIN_OFF,"PIN_OFF"]]), "EFFECT");
		    this.setPreviousStatement(true, null);
		    this.setNextStatement(true, null);
		    this.setColour(Blockly.Blocks.kniwwelino_RGB.HUE);
			this.setTooltip(Blockly.Msg.KNIWWELINO_PIN_EFFECT_TIP);
			this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL);
		  }
		};

Blockly.Blocks['kniwwelino_PINbuttonDown'] = {
		  init: function() {
		    this.appendDummyInput()
		    	.appendField(Blockly.Msg.KNIWWELINO_PIN_BUTTON)
		    	.appendField(new Blockly.FieldDropdown(Blockly.Arduino.Boards.selected.interrupt), 'PIN')
		    	.appendField(Blockly.Msg.KNIWWELINO_BUTTON_DOWN);
		    this.setOutput(true, Blockly.Types.BOOLEAN.output);
		    this.setTooltip(Blockly.Msg.KNIWWELINO_BUTTON_DOWN_TIP);
		    this.setColour(Blockly.Blocks.kniwwelino_BUTTONS.HUE);
		    this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'buttons');
		  },getBlockType: function() {
			    return Blockly.Types.BOOLEAN;
		  }
};

Blockly.Blocks['kniwwelino_PINbuttonClicked'] = {
		  init: function() {
		    this.appendDummyInput()
		    	.appendField(Blockly.Msg.KNIWWELINO_PIN_BUTTON)
		    	.appendField(new Blockly.FieldDropdown(Blockly.Arduino.Boards.selected.interrupt), 'PIN')
		    	.appendField(Blockly.Msg.KNIWWELINO_BUTTON_CLICKED);
		    this.setOutput(true, Blockly.Types.BOOLEAN.output);
		    this.setTooltip(Blockly.Msg.KNIWWELINO_BUTTON_CLICKED_TIP);
		    this.setColour(Blockly.Blocks.kniwwelino_BUTTONS.HUE);
		    this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'buttons');
		  },getBlockType: function() {
			    return Blockly.Types.BOOLEAN;
		  }
};


//==== LED MATRIX functions ==================================================
//void MATRIXwriteOnce(String text);
//void MATRIXwriteAndWait(String text);
//void MATRIXwrite(String text, int count, boolean wait);
//void MATRIXsetPixel(uint8_t x, uint8_t y, boolean on);

Blockly.Blocks['kniwwelino_MATRIXdrawIconCreator'] = {
  init: function() {
//    this.appendDummyInput()
//        .appendField(Blockly.Msg.KNIWWELINO_MATRIX_DRAWICONCREATOR);
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(new Blockly.FieldCheckbox("FALSE"), "1_1")
        .appendField(new Blockly.FieldCheckbox("FALSE"), "1_2")
        .appendField(new Blockly.FieldCheckbox("FALSE"), "1_3")
        .appendField(new Blockly.FieldCheckbox("FALSE"), "1_4")
        .appendField(new Blockly.FieldCheckbox("FALSE"), "1_5");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(new Blockly.FieldCheckbox("FALSE"), "2_1")
        .appendField(new Blockly.FieldCheckbox("FALSE"), "2_2")
        .appendField(new Blockly.FieldCheckbox("FALSE"), "2_3")
        .appendField(new Blockly.FieldCheckbox("FALSE"), "2_4")
        .appendField(new Blockly.FieldCheckbox("FALSE"), "2_5");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(new Blockly.FieldCheckbox("FALSE"), "3_1")
        .appendField(new Blockly.FieldCheckbox("FALSE"), "3_2")
        .appendField(new Blockly.FieldCheckbox("FALSE"), "3_3")
        .appendField(new Blockly.FieldCheckbox("FALSE"), "3_4")
        .appendField(new Blockly.FieldCheckbox("FALSE"), "3_5");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(new Blockly.FieldCheckbox("FALSE"), "4_1")
        .appendField(new Blockly.FieldCheckbox("FALSE"), "4_2")
        .appendField(new Blockly.FieldCheckbox("FALSE"), "4_3")
        .appendField(new Blockly.FieldCheckbox("FALSE"), "4_4")
        .appendField(new Blockly.FieldCheckbox("FALSE"), "4_5");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(new Blockly.FieldCheckbox("FALSE"), "5_1")
        .appendField(new Blockly.FieldCheckbox("FALSE"), "5_2")
        .appendField(new Blockly.FieldCheckbox("FALSE"), "5_3")
        .appendField(new Blockly.FieldCheckbox("FALSE"), "5_4")
        .appendField(new Blockly.FieldCheckbox("FALSE"), "5_5");
//    this.appendDummyInput();
	this.setOutput(true, Blockly.Types.TEXT.output);
    this.setColour(Blockly.Blocks.kniwwelino_MATRIX.HUE);
    this.setTooltip(Blockly.Msg.KNIWWELINO_MATRIX_DRAWICONCREATOR_TIP);
    this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'matrix');
  },getBlockType: function() {
	    return Blockly.Types.TEXT;
  }
};


Blockly.Blocks['kniwwelino_MATRIXdrawIconChooser'] = {
  init: function() {
    this.appendDummyInput()
        .appendField(Blockly.Msg.KNIWWELINO_MATRIX_DRAWICONCHOOSER)
        .appendField(new Blockly.FieldDropdown([
          [Blockly.Msg.KNIWWELINO_DRAWICON_HEART,		"ICON_HEART"],
          [Blockly.Msg.KNIWWELINO_DRAWICON_SMILE,		"ICON_SMILE"],
          [Blockly.Msg.KNIWWELINO_DRAWICON_SAD,			"ICON_SAD"],
          [Blockly.Msg.KNIWWELINO_DRAWICON_ARROW_UP,	"ICON_ARROW_UP"],
          [Blockly.Msg.KNIWWELINO_DRAWICON_ARROW_DOWN,	"ICON_ARROW_DOWN"],
          [Blockly.Msg.KNIWWELINO_DRAWICON_ARROW_LEFT,	"ICON_ARROW_LEFT"],
          [Blockly.Msg.KNIWWELINO_DRAWICON_ARROW_RIGHT,	"ICON_ARROW_RIGHT"]])
        , "ICON");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(Blockly.Blocks.kniwwelino_MATRIX.HUE);
    this.setTooltip(Blockly.Msg.KNIWWELINO_MATRIX_DRAWICONCHOOSER_TIP);
    this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'matrix');
  }
};

Blockly.Blocks['kniwwelino_MATRIXIconChooser'] = {
  init: function() {
		this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
          [Blockly.Msg.KNIWWELINO_DRAWICON_HEART,		"ICON_HEART"],
          [Blockly.Msg.KNIWWELINO_DRAWICON_SMILE,		"ICON_SMILE"],
          [Blockly.Msg.KNIWWELINO_DRAWICON_SAD,			"ICON_SAD"],
          [Blockly.Msg.KNIWWELINO_DRAWICON_ARROW_UP,	"ICON_ARROW_UP"],
          [Blockly.Msg.KNIWWELINO_DRAWICON_ARROW_DOWN,	"ICON_ARROW_DOWN"],
          [Blockly.Msg.KNIWWELINO_DRAWICON_ARROW_LEFT,	"ICON_ARROW_LEFT"],
          [Blockly.Msg.KNIWWELINO_DRAWICON_ARROW_RIGHT,	"ICON_ARROW_RIGHT"]])
        , "ICON_CHOOSER");
		this.setOutput(true, null);
    this.setColour(Blockly.Blocks.kniwwelino_MATRIX.HUE);
    this.setTooltip(Blockly.Msg.KNIWWELINO_MATRIX_DRAWICONCHOOSER_TIP);
    this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'matrix');
  }
};

Blockly.Blocks['kniwwelino_MATRIXdrawIcon'] = {
		  init: function() {
			this.setInputsInline(true);
			this.appendValueInput("ICON")
		        .appendField(Blockly.Msg.KNIWWELINO_MATRIX_DRAWICON);
		    this.setPreviousStatement(true, null);
		    this.setNextStatement(true, null);
		    this.setColour(Blockly.Blocks.kniwwelino_MATRIX.HUE);
		    this.setTooltip(Blockly.Msg.KNIWWELINO_MATRIX_DRAWICON_TIP);
		    this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'matrix');
		  }
		};

Blockly.Blocks['kniwwelino_MATRIXwrite'] = {
   init: function() {
		 this.setInputsInline(true);
		 this.appendValueInput("TEXT").appendField(Blockly.Msg.KNIWWELINO_MATRIX_WRITE)
		 this.appendDummyInput()
	     	.appendField(new Blockly.FieldDropdown([
	            [Blockly.Msg.KNIWWELINO_MATRIX_WRITE_NORMAL,"SCROLL"],
	            [Blockly.Msg.KNIWWELINO_MATRIX_WRITE_ONCE,	"ONCE"],
	            [Blockly.Msg.KNIWWELINO_MATRIX_WRITE_WAIT,	"WAIT"]])
	          , "TYPE");
	     this.setPreviousStatement(true, null);
	     this.setNextStatement(true, null);
	     this.setColour(Blockly.Blocks.kniwwelino_MATRIX.HUE);
	     this.setTooltip(Blockly.Msg.KNIWWELINO_MATRIX_WRITE_TIP);
	     this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'matrix');
   }
};

Blockly.Blocks['kniwwelino_MATRIXdrawPixel'] = {
  init: function() {
		this.appendDummyInput()
        .appendField(Blockly.Msg.KNIWWELINO_MATRIX_DRAWPIXEL);
    this.appendValueInput("X")
        .setCheck("Number")
        .appendField(Blockly.Msg.KNIWWELINO_MATRIX_DRAWPIXEL_X);
    this.appendValueInput("Y")
        .setCheck("Number")
        .appendField(Blockly.Msg.KNIWWELINO_MATRIX_DRAWPIXEL_Y);
    this.appendValueInput("STATE")
        .setCheck("Number")
        .appendField(Blockly.Msg.KNIWWELINO_MATRIX_DRAWPIXEL_STATE);
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
		this.setColour(Blockly.Blocks.kniwwelino_MATRIX.HUE);
		this.setTooltip(Blockly.Msg.KNIWWELINO_MATRIX_DRAWPIXEL_TIP);
		this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'matrix');
  },
	onchange: function(ev) {
    var x = Blockly.Arduino.valueToCode(this, 'X', Blockly.Arduino.ORDER_ATOMIC);
		var y = Blockly.Arduino.valueToCode(this, 'Y', Blockly.Arduino.ORDER_ATOMIC);
		if (x < 0 || x > 4) {
			swal({
				title: Blockly.Msg.KNIWWELINO_WARNING,
				text: Blockly.Msg.KNIWWELINO_MATRIX_DRAWPIXEL_WARNING,
				className: "kniwwelino-bg"
			});
    }
		if ( y < 0 || y > 4) {
			swal({
				title: Blockly.Msg.KNIWWELINO_WARNING,
				text: Blockly.Msg.KNIWWELINO_MATRIX_DRAWPIXEL_WARNING,
				className: "kniwwelino-bg"
			});
    }
  }
};

Blockly.Blocks['kniwwelino_MATRIXreadPixel'] = {
		  init: function() {
				this.appendDummyInput()
		        .appendField(Blockly.Msg.KNIWWELINO_MATRIX_READPIXEL);
		    this.appendValueInput("X")
		        .setCheck("Number")
		        .appendField(Blockly.Msg.KNIWWELINO_MATRIX_DRAWPIXEL_X);
		    this.appendValueInput("Y")
		        .setCheck("Number")
		        .appendField(Blockly.Msg.KNIWWELINO_MATRIX_DRAWPIXEL_Y);
		    this.setInputsInline(true);
		    //this.setPreviousStatement(true, null);
		    //this.setNextStatement(true, null);
		    this.setOutput(true, null);
			this.setColour(Blockly.Blocks.kniwwelino_MATRIX.HUE);
			this.setTooltip(Blockly.Msg.KNIWWELINO_MATRIX_READPIXEL_TIP);
			this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'matrix');
		  },
			onchange: function(ev) {
		    var x = Blockly.Arduino.valueToCode(this, 'X', Blockly.Arduino.ORDER_ATOMIC);
				var y = Blockly.Arduino.valueToCode(this, 'Y', Blockly.Arduino.ORDER_ATOMIC);
				if (x < 0 || x > 4) {
					swal({
						title: Blockly.Msg.KNIWWELINO_WARNING,
						text: Blockly.Msg.KNIWWELINO_MATRIX_DRAWPIXEL_WARNING,
						className: "kniwwelino-bg"
					});
		    }
				if ( y < 0 || y > 4) {
					swal({
						title: Blockly.Msg.KNIWWELINO_WARNING,
						text: Blockly.Msg.KNIWWELINO_MATRIX_DRAWPIXEL_WARNING,
						className: "kniwwelino-bg"
					});
		   }
		 } ,getBlockType: function() {
			    return Blockly.Types.NUMBER;
		 }
};

Blockly.Blocks['kniwwelino_MATRIXsetBrightness'] = {
   init: function() {
     this.appendDummyInput()
         .appendField(Blockly.Msg.KNIWWELINO_MATRIX_SETBRIGHTNESS)
         .appendField(new Blockly.FieldNumber(10, 0, 15, 0), 'BRIGHTNESS');
     this.setPreviousStatement(true, null);
     this.setNextStatement(true, null);
     this.setColour(Blockly.Blocks.kniwwelino_MATRIX.HUE);
     this.setTooltip(Blockly.Msg.KNIWWELINO_MATRIX_SETBRIGHTNESS_TIP);
     this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'matrix');
   },

   onchange: function() {
     if (this.getFieldValue('BRIGHTNESS') < 1 | this.getFieldValue('BRIGHTNESS') > 15) {
       this.setWarningText(Blockly.Msg.KNIWWELINO_MATRIX_SETBRIGHTNESS_ALERT);
       if (this.getFieldValue('BRIGHTNESS') < 1) {
         this.setFieldValue(1, 'BRIGHTNESS');
       } else if (this.getFieldValue('BRIGHTNESS') > 15) {
         this.setFieldValue(15, 'BRIGHTNESS');
       }
     } else {
       this.setWarningText(null);
     }
   }

};

Blockly.Blocks['kniwwelino_MATRIXsetBlinkRate'] = {
		   init: function() {
		     this.appendDummyInput()
		        .appendField(Blockly.Msg.KNIWWELINO_MATRIX_BLINKRATE)
		        .appendField(new Blockly.FieldDropdown(
		            [[Blockly.Msg.KNIWWELINO_PIN_ON,"MATRIX_STATIC"],
		            ["1/2Hz","MATRIX_BLINK_HALFHZ"],
		            ["1Hz","MATRIX_BLINK_1HZ"],
		            ["2Hz","MATRIX_BLINK_2HZ"]]), "RATE");
		     this.setPreviousStatement(true, null);
		     this.setNextStatement(true, null);
		     this.setColour(Blockly.Blocks.kniwwelino_MATRIX.HUE);
		     this.setTooltip(Blockly.Msg.KNIWWELINO_MATRIX_BLINKRATE_TIP);
		     this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'matrix');
		   }
		};

Blockly.Blocks['kniwwelino_MATRIXclear'] = {
   init: function() {
     this.appendDummyInput()
         .appendField(Blockly.Msg.KNIWWELINO_MATRIX_CLEAR);
     this.setPreviousStatement(true, null);
     this.setNextStatement(true, null);
     this.setColour(Blockly.Blocks.kniwwelino_MATRIX.HUE);
     this.setTooltip(Blockly.Msg.KNIWWELINO_MATRIX_CLEAR_TIP);
     this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'matrix');
   }
};

//==== Onboard Button functions ==============================================


Blockly.Blocks['kniwwelino_BUTTONdown'] = {
		  init: function() {
		    this.appendDummyInput()
		    .appendField(Blockly.Msg.KNIWWELINO_BUTTON)
		        .appendField(new Blockly.FieldDropdown(
		    [["A","A"],
		    ["B","B"],
		    [Blockly.Msg.KNIWWELINO_BUTTON_A_AND_B,"AandB"],
		    [Blockly.Msg.KNIWWELINO_BUTTON_A_OR_B,"AorB"]]), "BUTTON")
		    .appendField(Blockly.Msg.KNIWWELINO_BUTTON_DOWN);
		    this.setOutput(true, Blockly.Types.BOOLEAN.output);
		    this.setTooltip(Blockly.Msg.KNIWWELINO_BUTTON_DOWN_TIP);
		    this.setColour(Blockly.Blocks.kniwwelino_BUTTONS.HUE);
		    this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'buttons');
		  },getBlockType: function() {
			    return Blockly.Types.BOOLEAN;
		  }
};

Blockly.Blocks['kniwwelino_BUTTONclicked'] = {
		  init: function() {
		    this.appendDummyInput()
		    .appendField(Blockly.Msg.KNIWWELINO_BUTTON)
		        .appendField(new Blockly.FieldDropdown(
		    [["A","A"],
		    ["B","B"],
		    [Blockly.Msg.KNIWWELINO_BUTTON_A_AND_B,"AandB"],
		    [Blockly.Msg.KNIWWELINO_BUTTON_A_OR_B,"AorB"]]), "BUTTON")
		    .appendField(Blockly.Msg.KNIWWELINO_BUTTON_CLICKED);
		    this.setOutput(true, Blockly.Types.BOOLEAN.output);
		    this.setTooltip(Blockly.Msg.KNIWWELINO_BUTTON_CLICKED_TIP);
		    this.setColour(Blockly.Blocks.kniwwelino_BUTTONS.HUE);
		    this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'buttons');
		  },getBlockType: function() {
			    return Blockly.Types.BOOLEAN;
		  }
};


//==== IOT functions ==============================================


Blockly.Blocks['kniwwelino_MQTTsetGroup'] = {
		   init: function() {
				 this.setInputsInline(true);
//			     this.appendValueInput("GROUP")
			     this.appendDummyInput()
			         .appendField(Blockly.Msg.KNIWWELINO_MQTT_GROUP)
			                 .appendField(this.newQuote_(true))
			                 .appendField(new Blockly.FieldTextInput('myFriends'), 'GROUP')
			     			 .appendField(this.newQuote_(false));
//			     this.setPreviousStatement(true, null);
//			     this.setNextStatement(true, null);
			     this.setColour(Blockly.Blocks.kniwwelino_MQTT.HUE);
			     this.setTooltip(Blockly.Msg.KNIWWELINO_MQTT_GROUP_TIP);
			     this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'messages');
		   },

		   onchange: function() {
			       this.setFieldValue(this.getFieldValue('GROUP').trim().replace(" ","_").replace(/\W/g,""), 'GROUP');
			   },

		   newQuote_: function(open) {
			   if (open == this.RTL) {
				    var file = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAQAAAAqJXdxAAAAqUlEQVQI1z3KvUpCcRiA8ef9E4JNHhI0aFEacm1o0BsI0Slx8wa8gLauoDnoBhq7DcfWhggONDmJJgqCPA7neJ7p934EOOKOnM8Q7PDElo/4x4lFb2DmuUjcUzS3URnGib9qaPNbuXvBO3sGPHJDRG6fGVdMSeWDP2q99FQdFrz26Gu5Tq7dFMzUvbXy8KXeAj57cOklgA+u1B5AoslLtGIHQMaCVnwDnADZIFIrXsoXrgAAAABJRU5ErkJggg==';
				  } else {
				    var file = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAQAAAAqJXdxAAAAn0lEQVQI1z3OMa5BURSF4f/cQhAKjUQhuQmFNwGJEUi0RKN5rU7FHKhpjEH3TEMtkdBSCY1EIv8r7nFX9e29V7EBAOvu7RPjwmWGH/VuF8CyN9/OAdvqIXYLvtRaNjx9mMTDyo+NjAN1HNcl9ZQ5oQMM3dgDUqDo1l8DzvwmtZN7mnD+PkmLa+4mhrxVA9fRowBWmVBhFy5gYEjKMfz9AylsaRRgGzvZAAAAAElFTkSuQmCC';
				  }
				  return new Blockly.FieldImage(file, 12, 12, '"');
				},
				/** @return {!string} Type of the block, text block always a string. */
				getBlockType: function() {
				  return Blockly.Types.TEXT;
				}
		};

Blockly.Blocks['kniwwelino_MQTTconnectRGB'] = {
		   init: function() {
		     this.appendDummyInput()
		         .appendField(Blockly.Msg.KNIWWELINO_MQTT_CONNECT_RGB);
		     this.setColour(Blockly.Blocks.kniwwelino_MQTT.HUE);
		     this.setTooltip(Blockly.Msg.KNIWWELINO_MQTT_CONNECT_RGB_TIP);
		     this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'messages');
		   }
};

Blockly.Blocks['kniwwelino_MQTTconnectMATRIX'] = {
		   init: function() {
		     this.appendDummyInput()
		         .appendField(Blockly.Msg.KNIWWELINO_MQTT_CONNECT_MATRIX);
		     this.setColour(Blockly.Blocks.kniwwelino_MQTT.HUE);
		     this.setTooltip(Blockly.Msg.KNIWWELINO_MQTT_CONNECT_MATRIX_TIP);
		     this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'messages');
		   }
};

Blockly.Blocks['kniwwelino_MQTTpublishSimple'] = {
		   init: function() {
				 this.setInputsInline(true);
			     this.appendValueInput("MESSAGE").appendField(Blockly.Msg.KNIWWELINO_MQTT_SENTMESSAGE);
			     this.appendDummyInput()
			 		.appendField(Blockly.Msg.KNIWWELINO_MQTT_TOTOPIC)
			 		.appendField(new Blockly.FieldDropdown([
			 			["MATRIX/TEXT","MATRIX/TEXT"],
			 			["MATRIX/ICON","MATRIX/ICON"],
			 			["RGB/COLOR","RGB/COLOR"]])
			      , "TOPIC");
			     this.setPreviousStatement(true, null);
			     this.setNextStatement(true, null);
			     this.setColour(Blockly.Blocks.kniwwelino_MQTT.HUE);
			     this.setTooltip(Blockly.Msg.KNIWWELINO_MQTT_SENTMESSAGE_TIP);
			     this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'messages');
		   }
};

Blockly.Blocks['kniwwelino_MQTTsubscribe'] = {
		   init: function() {
				 this.setInputsInline(true);
			     this.appendValueInput("TOPIC")
			         .appendField(Blockly.Msg.KNIWWELINO_MQTT_ATTACH).appendField(new Blockly.FieldVariable(Blockly.Msg.VARIABLES_DEFAULT_NAME), "VAR")
			         .appendField(Blockly.Msg.KNIWWELINO_MQTT_TOTOPIC);
			     this.setColour(Blockly.Blocks.kniwwelino_MQTT.HUE);
			     this.setTooltip(Blockly.Msg.KNIWWELINO_MQTT_ATTACH_TIP);
			     this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'messages');
			     this.setOutput(false);
		   },
		   /**
		    * @return {!string} Retrieves the type (stored in varType) of this block.
		    * @this Blockly.Block
		    */
		   getBlockType: function() {
		     return [Blockly.Types.UNDEF, this.getFieldValue('VAR')];
		   },
		   /**
		    * Gets the stored type of the variable indicated in the argument. As only one
		    * variable is stored in this block, no need to check input
		    * @this Blockly.
		    * @param {!string} varName Name of this block variable to check type.
		    * @return {!string} String to indicate the type of this block.
		    */
		   getVarType: function(varName) {
		     return [Blockly.Types.UNDEF, this.getFieldValue('VAR')];
		   }
};

Blockly.Blocks['kniwwelino_MQTTsubscribePublic'] = {
		   init: function() {
				 this.setInputsInline(true);
			     this.appendValueInput("TOPIC")
			         .appendField(Blockly.Msg.KNIWWELINO_MQTT_ATTACH).appendField(new Blockly.FieldVariable(Blockly.Msg.VARIABLES_DEFAULT_NAME), "VAR")
			         .appendField(Blockly.Msg.KNIWWELINO_MQTT_TOPUBLICTOPIC);
			     this.setColour(Blockly.Blocks.kniwwelino_MQTT.HUE);
			     this.setTooltip(Blockly.Msg.KNIWWELINO_MQTT_ATTACH_TIP);
			     this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'messages');
			     this.setOutput(false);
		   },
		   /**
		    * @return {!string} Retrieves the type (stored in varType) of this block.
		    * @this Blockly.Block
		    */
		   getBlockType: function() {
		     return [Blockly.Types.UNDEF, this.getFieldValue('VAR')];
		   },
		   /**
		    * Gets the stored type of the variable indicated in the argument. As only one
		    * variable is stored in this block, no need to check input
		    * @this Blockly.
		    * @param {!string} varName Name of this block variable to check type.
		    * @return {!string} String to indicate the type of this block.
		    */
		   getVarType: function(varName) {
		     return [Blockly.Types.UNDEF, this.getFieldValue('VAR')];
		   }
};


Blockly.Blocks['kniwwelino_MQTTpublish'] = {
		   init: function() {
				 this.setInputsInline(true);
			     this.appendValueInput("MESSAGE").appendField(Blockly.Msg.KNIWWELINO_MQTT_SENTMESSAGE);
				 this.appendValueInput("TOPIC").appendField(Blockly.Msg.KNIWWELINO_MQTT_TOTOPIC);
			     this.setPreviousStatement(true, null);
			     this.setNextStatement(true, null);
			     this.setColour(Blockly.Blocks.kniwwelino_MQTT.HUE);
			     this.setTooltip(Blockly.Msg.KNIWWELINO_MQTT_SENTMESSAGE_TIP);
			     this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'messages');
		   }
};

//==== SENSORS ==============================================

Blockly.Blocks['kniwwelino_BME280getValue'] = {
		  init: function() {
			  this.appendDummyInput()
			    .appendField("BME280" + Blockly.Msg.KNIWWELINO_SENSOR_READ)
		        .appendField(new Blockly.FieldDropdown(
					    [
					    	[Blockly.Msg.KNIWWELINO_SENSOR_TEMP,"TEMPERATURE"],
					    	[Blockly.Msg.KNIWWELINO_SENSOR_HUM,"HUMIDITY"],
					    	[Blockly.Msg.KNIWWELINO_SENSOR_PRESSURE,"PRESSURE"],
					    	[Blockly.Msg.KNIWWELINO_SENSOR_HEIGHT,"HEIGHT"]
					    ]), "VALUE");
		    this.setOutput(true, Blockly.Types.NUMBER.output);
		    this.setTooltip(Blockly.Msg.KNIWWELINO_SENSOR_TIP);
		    this.setColour(Blockly.Blocks.kniwwelino_SENSOR.HUE);
		    this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + '../extensions/exti2csensor');
		  },getBlockType: function() {
			    return Blockly.Types.NUMBER;
		  }
};

Blockly.Blocks['kniwwelino_BME680getValue'] = {
		  init: function() {
			  this.appendDummyInput()
			    .appendField("BME680" + Blockly.Msg.KNIWWELINO_SENSOR_READ)
		        .appendField(new Blockly.FieldDropdown(
					    [
					    	[Blockly.Msg.KNIWWELINO_SENSOR_TEMP,"TEMPERATURE"],
					    	[Blockly.Msg.KNIWWELINO_SENSOR_HUM,"HUMIDITY"],
					    	[Blockly.Msg.KNIWWELINO_SENSOR_GAS,"GAS"],
					    	[Blockly.Msg.KNIWWELINO_SENSOR_PRESSURE,"PRESSURE"],
					    	[Blockly.Msg.KNIWWELINO_SENSOR_HEIGHT,"HEIGHT"]
					    ]), "VALUE");
		    this.setOutput(true, Blockly.Types.NUMBER.output);
		    this.setTooltip(Blockly.Msg.KNIWWELINO_SENSOR_TIP);
		    this.setColour(Blockly.Blocks.kniwwelino_SENSOR.HUE);
		    this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + '../extensions/exti2csensor');
		  },getBlockType: function() {
			    return Blockly.Types.NUMBER;
		  }
};

Blockly.Blocks['kniwwelino_SHT30getValue'] = {
		  init: function() {
			  this.appendDummyInput()
			    .appendField("SHT30" + Blockly.Msg.KNIWWELINO_SENSOR_READ)
		        .appendField(new Blockly.FieldDropdown(
					    [
					    	[Blockly.Msg.KNIWWELINO_SENSOR_TEMP,"TEMPERATURE"],
					    	[Blockly.Msg.KNIWWELINO_SENSOR_HUM,"HUMIDITY"],
					    ]), "VALUE");
		    this.setOutput(true, Blockly.Types.NUMBER.output);
		    this.setTooltip(Blockly.Msg.KNIWWELINO_SENSOR_TIP);
		    this.setColour(Blockly.Blocks.kniwwelino_SENSOR.HUE);
		    this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + '../extensions/exti2csensor');
		  },getBlockType: function() {
			    return Blockly.Types.NUMBER;
		  }
};

Blockly.Blocks['kniwwelino_BH1750getLightLevel'] = {
		  init: function() {
			  this.appendDummyInput()
			    .appendField("BH1750" + Blockly.Msg.KNIWWELINO_SENSOR_READ + Blockly.Msg.KNIWWELINO_SENSOR_LIGHTLEVEL);
		    this.setOutput(true, Blockly.Types.NUMBER.output);
		    this.setTooltip(Blockly.Msg.KNIWWELINO_SENSOR_TIP);
		    this.setColour(Blockly.Blocks.kniwwelino_SENSOR.HUE);
		    this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + '../extensions/exti2csensor');
		  },getBlockType: function() {
			    return Blockly.Types.NUMBER;
		  }
};

Blockly.Blocks['kniwwelino_ADPS9960getValue'] = {
		  init: function() {
			  this.appendDummyInput()
			    .appendField("ADPS9960" + Blockly.Msg.KNIWWELINO_SENSOR_READ)
			        .appendField(new Blockly.FieldDropdown(
			    [
			    	[Blockly.Msg.KNIWWELINO_SENSOR_PROXIMITY,"PROXIMITY"],
			    	[Blockly.Msg.KNIWWELINO_SENSOR_GESTURE,"GESTURE"],
			    	[Blockly.Msg.KNIWWELINO_SENSOR_WHITE,"WHITE"],
			    	[Blockly.Msg.KNIWWELINO_SENSOR_RED,"RED"],
			    	[Blockly.Msg.KNIWWELINO_SENSOR_GREEN,"GREEN"],
			    	[Blockly.Msg.KNIWWELINO_SENSOR_BLUE,"BLUE"]
			    ]), "VALUE");
		    this.setOutput(true, Blockly.Types.NUMBER.output);
		    this.setTooltip(Blockly.Msg.KNIWWELINO_SENSOR_TIP);
		    this.setColour(Blockly.Blocks.kniwwelino_SENSOR.HUE);
		    this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + '../extensions/exti2csensor');
		  },getBlockType: function() {
			    return Blockly.Types.NUMBER;
		  }
};


Blockly.Blocks['kniwwelino_HCSR04getValue'] = {
		  init: function() {
			  this.appendDummyInput()
			    .appendField("HC-SR04" + Blockly.Msg.KNIWWELINO_SENSOR_READ + Blockly.Msg.KNIWWELINO_SENSOR_DISTANCE + Blockly.Msg.KNIWWELINO_SENSOR_CM);
		    this.setOutput(true, Blockly.Types.NUMBER.output);
		    this.setTooltip(Blockly.Msg.KNIWWELINO_SENSOR_TIP);
		    this.setColour(Blockly.Blocks.kniwwelino_SENSOR.HUE);
		    this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + '../extensions/extothersensor');
		  },getBlockType: function() {
			    return Blockly.Types.NUMBER;
		  }
};

//==== WEATHER ============================================

Blockly.Blocks['kniwwelino_WeatherTopicChooser'] = {
	init: function() {
		this.appendDummyInput()
				.appendField(Blockly.Msg.KNIWWELINO_LOCATION_FOR)
        .appendField(new Blockly.FieldDropdown([
					[Blockly.Msg.KNIWWELINO_LOCATION_LUXEMBOURG,"luxembourg"],
					[Blockly.Msg.KNIWWELINO_LOCATION_BELVAL,"belval"],
					[Blockly.Msg.KNIWWELINO_LOCATION_ECHTERNACH,"echternach"],
					[Blockly.Msg.KNIWWELINO_LOCATION_ETTELBRUCK,"ettelbruck"]])
				, "LOCATION")
				.appendField(Blockly.Msg.KNIWWELINO_LOCATION_GET)
        .appendField(new Blockly.FieldDropdown([
					[Blockly.Msg.KNIWWELINO_WEATHER_WEATHER,"weather"],
					[Blockly.Msg.KNIWWELINO_WEATHER_TEMP,"temp"],
					[Blockly.Msg.KNIWWELINO_WEATHER_HUMIDITY, "humidity"],
					[Blockly.Msg.KNIWWELINO_WEATHER_PRESSURE, "pressure"],
					[Blockly.Msg.KNIWWELINO_WEATHER_WINDSPEED, "windspeed"],
					[Blockly.Msg.KNIWWELINO_WEATHER_WINDDIR, "winddir"]])
				, "WEATHER_PAR");
		this.setOutput(true, null);
    this.setColour(Blockly.Blocks.kniwwelino_SENSOR.HUE);
    this.setTooltip(Blockly.Msg.KNIWWELINO_MATRIX_WEATHERTOPICCHOOSER_TIP);
    this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'weather');
	}
};

Blockly.Blocks['kniwwelino_WeatherConstChooser'] = {
	init: function() {
		this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([
					[Blockly.Msg.KNIWWELINO_WEATHER_COND_THUNDERSTORM,"Thunderstorm"],
					[Blockly.Msg.KNIWWELINO_WEATHER_COND_DRIZZLE,"Drizzle"],
					[Blockly.Msg.KNIWWELINO_WEATHER_COND_RAIN, "Rain"],
					[Blockly.Msg.KNIWWELINO_WEATHER_COND_SNOW, "Snow"],
					[Blockly.Msg.KNIWWELINO_WEATHER_COND_ATMOSPHERE, "Atmosphere"],
					[Blockly.Msg.KNIWWELINO_WEATHER_COND_CLEAR, "Clear"],
					[Blockly.Msg.KNIWWELINO_WEATHER_COND_CLOUDS, "Clouds"]])
				, "WEATHER_CONST");
		this.setOutput(true, null);
    this.setColour(Blockly.Blocks.kniwwelino_SENSOR.HUE);
    this.setTooltip(Blockly.Msg.KNIWWELINO_MATRIX_WEATHERCONSTCHOOSER_TIP);
    this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + 'weather');
	}
};




//==== AUDIO ==============================================

Blockly.Blocks['kniwwelino_playNote'] = {
		  init: function() {
			this.setInputsInline(true);
		    this.appendValueInput("NOTE")
			     .appendField(Blockly.Msg.KNIWWELINO_AUDIO_PLAY_NOTE);
		    this.appendValueInput("NOTE_DURATION")
		         .appendField(Blockly.Msg.KNIWWELINO_AUDIO_NOTE_DURATION);
		    this.appendDummyInput()
	        .appendField(Blockly.Msg.KNIWWELINO_AUDIO_PIN)
	        .appendField(new Blockly.FieldDropdown(
	        		Blockly.Arduino.Boards.selected.pwmPins), "TONEPIN");
		    this.setPreviousStatement(true);
		    this.setNextStatement(true);
		    this.setColour(Blockly.Blocks.kniwwelino_AUDIO.HUE);
		    this.setTooltip(Blockly.Msg.KNIWWELINO_TONEOFF_TIP);
		    this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + '../extensions/audio');
		  },
		    /** @return {!string} The type of input value for the block, an integer. */
		  getBlockType: function() {
		    return Blockly.Types.NUMBER;
		  }
};


Blockly.Blocks['kniwwelino_playTone'] = {
		  init: function() {
			this.setInputsInline(true);
		    this.appendValueInput("NOTE")
			     .appendField(Blockly.Msg.KNIWWELINO_AUDIO_PLAY_TONE);
		    this.appendDummyInput()
	        .appendField(Blockly.Msg.KNIWWELINO_AUDIO_PIN)
	        .appendField(new Blockly.FieldDropdown(
	        		Blockly.Arduino.Boards.selected.pwmPins), "TONEPIN");
		    this.setPreviousStatement(true);
		    this.setNextStatement(true);
		    this.setColour(Blockly.Blocks.kniwwelino_AUDIO.HUE);
		    this.setTooltip(Blockly.Msg.KNIWWELINO_TONEOFF_TIP);
		    this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + '../extensions/audio');
		  },
		    /** @return {!string} The type of input value for the block, an integer. */
		  getBlockType: function() {
		    return Blockly.Types.NUMBER;
		  }
};

Blockly.Blocks['kniwwelino_toneOff'] = {
		  init: function() {
		    this.appendDummyInput()
		        .appendField(Blockly.Msg.KNIWWELINO_AUDIO_TONEOFF)
		        .appendField(new Blockly.FieldDropdown(
		        		Blockly.Arduino.Boards.selected.pwmPins), "TONEPIN");
		    this.setPreviousStatement(true);
		    this.setNextStatement(true);
		    this.setColour(Blockly.Blocks.kniwwelino_AUDIO.HUE);
		    this.setTooltip(Blockly.Msg.KNIWWELINO_TONEOFF_TIP);
		    this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + '../extensions/audio');
		  },
		    /** @return {!string} The type of input value for the block, an integer. */
		  getBlockType: function() {
		    return Blockly.Types.NUMBER;
		  }
};


Blockly.Blocks['kniwwelino_toneChooser'] = {
		  init: function() {
				this.appendDummyInput()
				.appendField(new Blockly.FieldImage("../ardublockly/font/font-awesome-4.7.0/music.svg", 15, 15, "*"))
		        .appendField(new Blockly.FieldDropdown([
		        	["Pause 0Hz","0 /*Silence*/"],
		        	["B0 31Hz","NOTE_B0 /*31Hz*/"],
		        	["C1 33Hz","NOTE_C1 /*33Hz*/"],
		        	["CS1 35Hz","NOTE_CS1 /*35Hz*/"],
		        	["D1 37Hz","NOTE_D1 /*37Hz*/"],
		        	["DS1 39Hz","NOTE_DS1 /*39Hz*/"],
		        	["E1 41Hz","NOTE_E1 /*41Hz*/"],
		        	["F1 44Hz","NOTE_F1 /*44Hz*/"],
		        	["FS1 46Hz","NOTE_FS1 /*46Hz*/"],
		        	["G1 49Hz","NOTE_G1 /*49Hz*/"],
		        	["GS1 52Hz","NOTE_GS1 /*52Hz*/"],
		        	["A1 55Hz","NOTE_A1 /*55Hz*/"],
		        	["AS1 58Hz","NOTE_AS1 /*58Hz*/"],
		        	["B1 62Hz","NOTE_B1 /*62Hz*/"],
		        	["C2 65Hz","NOTE_C2 /*65Hz*/"],
		        	["CS2 69Hz","NOTE_CS2 /*69Hz*/"],
		        	["D2 73Hz","NOTE_D2 /*73Hz*/"],
		        	["DS2 78Hz","NOTE_DS2 /*78Hz*/"],
		        	["E2 82Hz","NOTE_E2 /*82Hz*/"],
		        	["F2 87Hz","NOTE_F2 /*87Hz*/"],
		        	["FS2 93Hz","NOTE_FS2 /*93Hz*/"],
		        	["G2 98Hz","NOTE_G2 /*98Hz*/"],
		        	["GS2 104Hz","NOTE_GS2 /*104Hz*/"],
		        	["A2 110Hz","NOTE_A2 /*110Hz*/"],
		        	["AS2 117Hz","NOTE_AS2 /*117Hz*/"],
		        	["B2 123Hz","NOTE_B2 /*123Hz*/"],
		        	["C3 131Hz","NOTE_C3 /*131Hz*/"],
		        	["CS3 139Hz","NOTE_CS3 /*139Hz*/"],
		        	["D3 147Hz","NOTE_D3 /*147Hz*/"],
		        	["DS3 156Hz","NOTE_DS3 /*156Hz*/"],
		        	["E3 165Hz","NOTE_E3 /*165Hz*/"],
		        	["F3 175Hz","NOTE_F3 /*175Hz*/"],
		        	["FS3 185Hz","NOTE_FS3 /*185Hz*/"],
		        	["G3 196Hz","NOTE_G3 /*196Hz*/"],
		        	["GS3 208Hz","NOTE_GS3 /*208Hz*/"],
		        	["A3 220Hz","NOTE_A3 /*220Hz*/"],
		        	["AS3 233Hz","NOTE_AS3 /*233Hz*/"],
		        	["B3 247Hz","NOTE_B3 /*247Hz*/"],
		        	["C4 262Hz","NOTE_C4 /*262Hz*/"],
		        	["CS4 277Hz","NOTE_CS4 /*277Hz*/"],
		        	["D4 294Hz","NOTE_D4 /*294Hz*/"],
		        	["DS4 311Hz","NOTE_DS4 /*311Hz*/"],
		        	["E4 330Hz","NOTE_E4 /*330Hz*/"],
		        	["F4 349Hz","NOTE_F4 /*349Hz*/"],
		        	["FS4 370Hz","NOTE_FS4 /*370Hz*/"],
		        	["G4 392Hz","NOTE_G4 /*392Hz*/"],
		        	["GS4 415Hz","NOTE_GS4 /*415Hz*/"],
		        	["A4 440Hz","NOTE_A4 /*440Hz*/"],
		        	["AS4 466Hz","NOTE_AS4 /*466Hz*/"],
		        	["B4 494Hz","NOTE_B4 /*494Hz*/"],
		        	["C5 523Hz","NOTE_C5 /*523Hz*/"],
		        	["CS5 554Hz","NOTE_CS5 /*554Hz*/"],
		        	["D5 587Hz","NOTE_D5 /*587Hz*/"],
		        	["DS5 622Hz","NOTE_DS5 /*622Hz*/"],
		        	["E5 659Hz","NOTE_E5 /*659Hz*/"],
		        	["F5 698Hz","NOTE_F5 /*698Hz*/"],
		        	["FS5 740Hz","NOTE_FS5 /*740Hz*/"],
		        	["G5 784Hz","NOTE_G5 /*784Hz*/"],
		        	["GS5 831Hz","NOTE_GS5 /*831Hz*/"],
		        	["A5 880Hz","NOTE_A5 /*880Hz*/"],
		        	["AS5 932Hz","NOTE_AS5 /*932Hz*/"],
		        	["B5 988Hz","NOTE_B5 /*988Hz*/"],
		        	["C6 1047Hz","NOTE_C6 /*1047Hz*/"],
		        	["CS6 1109Hz","NOTE_CS6 /*1109Hz*/"],
		        	["D6 1175Hz","NOTE_D6 /*1175Hz*/"],
		        	["DS6 1245Hz","NOTE_DS6 /*1245Hz*/"],
		        	["E6 1319Hz","NOTE_E6 /*1319Hz*/"],
		        	["F6 1397Hz","NOTE_F6 /*1397Hz*/"],
		        	["FS6 1480Hz","NOTE_FS6 /*1480Hz*/"],
		        	["G6 1568Hz","NOTE_G6 /*1568Hz*/"],
		        	["GS6 1661Hz","NOTE_GS6 /*1661Hz*/"],
		        	["A6 1760Hz","NOTE_A6 /*1760Hz*/"],
		        	["AS6 1865Hz","NOTE_AS6 /*1865Hz*/"],
		        	["B6 1976Hz","NOTE_B6 /*1976Hz*/"],
		        	["C7 2093Hz","NOTE_C7 /*2093Hz*/"],
		        	["CS7 2217Hz","NOTE_CS7 /*2217Hz*/"],
		        	["D7 2349Hz","NOTE_D7 /*2349Hz*/"],
		        	["DS7 2489Hz","NOTE_DS7 /*2489Hz*/"],
		        	["E7 2637Hz","NOTE_E7 /*2637Hz*/"],
		        	["F7 2794Hz","NOTE_F7 /*2794Hz*/"],
		        	["FS7 2960Hz","NOTE_FS7 /*2960Hz*/"],
		        	["G7 3136Hz","NOTE_G7 /*3136Hz*/"],
		        	["GS7 3322Hz","NOTE_GS7 /*3322Hz*/"],
		        	["A7 3520Hz","NOTE_A7 /*3520Hz*/"],
		        	["AS7 3729Hz","NOTE_AS7 /*3729Hz*/"],
		        	["B7 3951Hz","NOTE_B7 /*3951Hz*/"],
		        	["C8 4186Hz","NOTE_C8 /*4186Hz*/"],
		        	["CS8 4435Hz","NOTE_CS8 /*4435Hz*/"],
		        	["D8 4699Hz","NOTE_D8 /*4699Hz*/"],
		        	["DS8 4978Hz","NOTE_DS8 /*4978Hz*/"]
		        	])
		        , "NOTE");
				this.setOutput(true, null);
		    this.setColour(Blockly.Blocks.kniwwelino_AUDIO.HUE);
		    this.setTooltip(Blockly.Msg.KNIWWELINO_MATRIX_DRAWICONCHOOSER_TIP);
		    this.setHelpUrl(Blockly.Msg.KNIWWELINO_HELPURL + '../extensions/audio');
		  }
		};
