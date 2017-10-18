/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Code generator for the Kniwwelino Library.
 * Kniwwelino library docs: https://kniwwelino.github.io/en/reference/
 */
'use strict';

goog.provide('Blockly.Arduino.kniwwelino');

goog.require('Blockly.Arduino');


//Create a dictionary 
var MQTTSubscriptions_ = {};
function addMQTTSubscription(topic, variable) {
	  //if (Blockly.Arduino.definitions_[topic] === undefined) {
		  MQTTSubscriptions_[variable] = topic;
	  //}
};
Blockly.Arduino['kniwwelinoClear'] = function(block) {
	MQTTSubscriptions_ = {};
};

function kniwwelinoBaseCode() {
	Blockly.Arduino.addInclude('kniwwelino', '#include <Kniwwelino.h>');
	Blockly.Arduino.addSetup('kniwwelino', '//Initialize the Kniwwelino Board\n  Kniwwelino.begin(true, true); // Wifi=true, Fastboot=true', true);
	
	// Adding something to the loop() is not possible right now. 
	// please add the following code to the Blockly.Arduino.finish function in generators/arduino.js
	//
	// code = code + '\nKniwwelino.loop(); // do background stuff...';
}

function kniwwelinoMQTTCode() {    
	Blockly.Arduino.addSetup('MQTTonMessage', 'Kniwwelino.MQTTonMessage(messageReceived);', true);
	
	var subs = "";
	var cond = '  if ';
	for(var variable in MQTTSubscriptions_){
		  subs += cond+'(topic==' + MQTTSubscriptions_[variable] +') {\n' +
		  '    ' + variable + ' = payload;\n' +
		  '  }';		  
		  cond = ' else if ';
	}
	Blockly.Arduino.addFunction('MQTTonMessage', 'static void messageReceived(String &topic, String &payload) {\n'+
			'  Serial.println("incoming: " + topic + " - " + payload);\n'+
		    subs + 
			'\n}\n', true);
}



//==== Kniwwelino functions===================================================

Blockly.Arduino['kniwwelino_getID'] = function(block) {
	kniwwelinoBaseCode();
	return ['Kniwwelino.getID()', Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['kniwwelino_getName'] = function(block) {
	kniwwelinoBaseCode();
	return ['Kniwwelino.getName()', Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['kniwwelino_getIP'] = function(block) {
	kniwwelinoBaseCode();
	return ['Kniwwelino.getIP()', Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['kniwwelino_getMAC'] = function(block) {
	kniwwelinoBaseCode();
	return ['Kniwwelino.getMAC()', Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['kniwwelino_sleep'] = function(block) {
	kniwwelinoBaseCode();
	var delayTime = Blockly.Arduino.valueToCode(
	      block, 'DELAY_TIME_MILI', Blockly.Arduino.ORDER_ATOMIC) || '0';
	return 'Kniwwelino.sleep(' + delayTime + ');\n' ;
};

//==== RGB LED  functions ====================================================

Blockly.Arduino['kniwwelino_RGBselectColor'] = function(block) {
	kniwwelinoBaseCode();
	return ['"'+block.getFieldValue('COLOR').replace("#","").toUpperCase()+'"', Blockly.Arduino.ORDER_ATOMIC];
};


Blockly.Arduino['kniwwelino_RGBsetColor'] = function(block) {
	kniwwelinoBaseCode();
	var color = block.getFieldValue('COLOR').replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
	             ,(m, r, g, b) => '#' + r + r + g + g + b + b)
	    .substring(1).match(/.{2}/g)
	    .map(x => parseInt(x, 16)) ;
	return 'Kniwwelino.RGBsetColor(' + color[0] + ', ' + color[1] + ', ' + color[2] + ');\n';
};

Blockly.Arduino['kniwwelino_RGBsetColorEffect'] = function(block) {
	kniwwelinoBaseCode();
	var color = block.getFieldValue('COLOR').replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i
		         ,(m, r, g, b) => '#' + r + r + g + g + b + b)
		    .substring(1).match(/.{2}/g)
		    .map(x => parseInt(x, 16)) ;
	return 'Kniwwelino.RGBsetColorEffect(' + color[0] + ', ' + color[1] + ', ' + color[2] + ', ' + 
		 block.getFieldValue('EFFECT') + ', -1' +');\n';
};	
	
Blockly.Arduino['kniwwelino_RGBsetColorFromString'] = function(block) {
	kniwwelinoBaseCode();
	var color = Blockly.Arduino.valueToCode(block, 'COLOR', Blockly.Arduino.ORDER_UNARY_POSTFIX);
	return  'Kniwwelino.RGBsetColor(String('+color+'));\n';
};
	
Blockly.Arduino['kniwwelino_RGBclear'] = function(block) {
	kniwwelinoBaseCode();
	return  'Kniwwelino.RGBclear();\n';
};

//==== LED MATRIX functions ==================================================

Blockly.Arduino['kniwwelino_MATRIXdrawIconCreator'] = function(block) {
	kniwwelinoBaseCode();
	var pixels = "";
	for (var x = 1; x < 6; x++) {
		for (var y = 1; y < 6; y++) {
			var led = x + '_' + y;
			console.log("LED to read: " + led);
			if (block.getFieldValue(led) == "TRUE") {
				pixels = pixels.concat('1');
			} else {
				pixels = pixels.concat('0');
			}
		}
	}
	return ['"B' + pixels +'"', Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['kniwwelino_MATRIXdrawIconChooser'] = function(block) {
	kniwwelinoBaseCode();
	var icon = block.getFieldValue('ICON');
	return  'Kniwwelino.MATRIXdrawIcon(' + icon + ');\n';
};

Blockly.Arduino['kniwwelino_MATRIXdrawIcon'] = function(block) {
	kniwwelinoBaseCode();
	var text = Blockly.Arduino.valueToCode(block, 'TEXT',Blockly.Arduino.ORDER_UNARY_POSTFIX);
	return  'Kniwwelino.MATRIXdrawIcon(String(' + text + '));\n';
};

Blockly.Arduino['kniwwelino_MATRIXwrite'] = function(block) {
	kniwwelinoBaseCode();
	var text = Blockly.Arduino.valueToCode(block, 'TEXT',Blockly.Arduino.ORDER_UNARY_POSTFIX);
	var type = block.getFieldValue('TYPE');
	if (type == "SCROLL") {
		return 'Kniwwelino.MATRIXwrite(String(' + text + '));\n';
	} else if (type == "WAIT") {
		return 'Kniwwelino.MATRIXwriteAndWait(String(' + text + '));\n';
	} else if (type == "ONCE") {
		return 'Kniwwelino.MATRIXwriteOnce(String(' + text + '));\n';
	} 
};

Blockly.Arduino['kniwwelino_MATRIXsetBrightness'] = function(block) {
	kniwwelinoBaseCode();
	var brightness = block.getFieldValue('BRIGHTNESS');
	return  'Kniwwelino.MATRIXsetBrightness(' + brightness + ');\n';
};

Blockly.Arduino['kniwwelino_MATRIXsetBlinkRate'] = function(block) {
	kniwwelinoBaseCode();
	var blinkrate = block.getFieldValue('RATE');
	return 'Kniwwelino.MATRIXsetBlinkRate(' + blinkrate + ');\n';
};

Blockly.Arduino['kniwwelino_MATRIXclear'] = function(block) {
	kniwwelinoBaseCode();
	return  'Kniwwelino.MATRIXclear();\n';
};

//==== Onboard Button functions ==============================================

Blockly.Arduino['kniwwelino_BUTTONdown'] = function(block) {
	kniwwelinoBaseCode();
	var button = block.getFieldValue('BUTTON');
	if (button == 'AandB')  {
		return ['Kniwwelino.BUTTONAdown() && Kniwwelino.BUTTONBdown()', Blockly.Arduino.ORDER_ATOMIC];		
	} else if (button == 'AorB')  {
		return ['Kniwwelino.BUTTONAdown() || Kniwwelino.BUTTONBdown()', Blockly.Arduino.ORDER_ATOMIC];		
	} else {
		return ['Kniwwelino.BUTTON'+button+'down()', Blockly.Arduino.ORDER_ATOMIC];		
	}
};

Blockly.Arduino['kniwwelino_BUTTONclicked'] = function(block) {
	kniwwelinoBaseCode();
	var button = block.getFieldValue('BUTTON');
	if (button == 'AandB')  {
		return ['Kniwwelino.BUTTONAclicked() && Kniwwelino.BUTTONBclicked()', Blockly.Arduino.ORDER_ATOMIC];		
	} else if (button == 'AorB')  {
		return ['Kniwwelino.BUTTONAclicked() || Kniwwelino.BUTTONBclicked()', Blockly.Arduino.ORDER_ATOMIC];		
	} else {
		return ['Kniwwelino.BUTTON'+button+'clicked()', Blockly.Arduino.ORDER_ATOMIC];
	}
};


//==== MQTT functions ==============================================

Blockly.Arduino['kniwwelino_MQTTsetGroup'] = function(block) {
	kniwwelinoBaseCode();
	var group = Blockly.Arduino.valueToCode(block, 'GROUP',Blockly.Arduino.ORDER_UNARY_POSTFIX);
	Blockly.Arduino.addSetup('kniwwelino_MQTTsetGroup','Kniwwelino.MQTTsetGroup(String(' + group + '));', true);
	kniwwelinoMQTTCode();
	return '';
};

Blockly.Arduino['kniwwelino_MQTTconnectRGB'] = function(block) {
	kniwwelinoBaseCode();
	kniwwelinoMQTTCode();
	Blockly.Arduino.addSetup('Kniwwelino.MQTTconnectRGB', 'Kniwwelino.MQTTconnectRGB();', true);
	return  '';
}

Blockly.Arduino['kniwwelino_MQTTconnectMATRIX'] = function(block) {
	kniwwelinoBaseCode();
	kniwwelinoMQTTCode();
	Blockly.Arduino.addSetup('Kniwwelino.MQTTconnectMATRIX', 'Kniwwelino.MQTTconnectMATRIX();', true);
	return  '';
}

Blockly.Arduino['kniwwelino_MQTTpublishSimple'] = function(block) {
	kniwwelinoBaseCode();
	kniwwelinoMQTTCode();
	var topic = block.getFieldValue('TOPIC');
	var message = Blockly.Arduino.valueToCode(block, 'MESSAGE',Blockly.Arduino.ORDER_UNARY_POSTFIX);
	return  'Kniwwelino.MQTTpublish("'+topic+'", String('+message+'));\n';
};

Blockly.Arduino['kniwwelino_MQTTsubscribe'] = function(block) {
	kniwwelinoBaseCode();
	kniwwelinoMQTTCode();
	var topic = Blockly.Arduino.valueToCode(block, 'TOPIC',Blockly.Arduino.ORDER_UNARY_POSTFIX);
	var varName = Blockly.Arduino.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);

	addMQTTSubscription(topic, varName);
	
	Blockly.Arduino.addSetup('kniwwelino_MQTTsubscribe','Kniwwelino.MQTTsubscribe(' + topic + ');', true);
	return '';
};

Blockly.Arduino['kniwwelino_MQTTpublish'] = function(block) {
	kniwwelinoBaseCode();
	kniwwelinoMQTTCode();
	var topic = Blockly.Arduino.valueToCode(block, 'TOPIC',Blockly.Arduino.ORDER_UNARY_POSTFIX);
	var message = Blockly.Arduino.valueToCode(block, 'MESSAGE',Blockly.Arduino.ORDER_UNARY_POSTFIX);
	return  'Kniwwelino.MQTTpublish('+topic+', String('+message+'));\n';
};


