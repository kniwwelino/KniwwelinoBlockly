/**
 *  @license Copyright (C) 2017 Luxembourg Institute of Science and Technology.
 * KinwwelinoBlockly is Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * @fileoverview Code generator for the Kniwwelino Library.
 * Kniwwelino library docs: https://doku.kniwwelino.lu/en/reference/
 */
'use strict';

goog.provide('Blockly.Arduino.kniwwelino');

goog.require('Blockly.Arduino');

function kniwwelinoBaseCode() {
	Blockly.Arduino.addInclude('kniwwelino', '#include <Kniwwelino.h>');
	Blockly.Arduino.addSetup('kniwwelinoBegin', '//Initialize the Kniwwelino Board\n  Kniwwelino.begin("'+Ardublockly.getSketchName(20)+'", true, true, false); // Wifi=true, Fastboot=true, MQTT Logging=false\n', true);

	// Adding something to the loop() is not possible right now.
	// please add the following code to the Blockly.Arduino.finish function in generators/arduino.js
	//
	// code = code + '\nKniwwelino.loop(); // do background stuff...';
}

function kniwwelinoMQTTCode() {
	Blockly.Arduino.addSetup('MQTTonMessage', 'Kniwwelino.MQTTonMessage(messageReceived);', true);
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

Blockly.Arduino['kniwwelino_log'] = function(block) {
	kniwwelinoBaseCode();
	var text = Blockly.Arduino.valueToCode(block, 'TEXT', Blockly.Arduino.ORDER_UNARY_POSTFIX);
	return  'Kniwwelino.log(String('+text+'));\n';
};

Blockly.Arduino['kniwwelino_logln'] = function(block) {
	kniwwelinoBaseCode();
	var text = Blockly.Arduino.valueToCode(block, 'TEXT', Blockly.Arduino.ORDER_UNARY_POSTFIX);
	return  'Kniwwelino.logln(String('+text+'));\n';
};


Blockly.Arduino['kniwwelino_sleep'] = function(block) {
	kniwwelinoBaseCode();
	var delayTime = Blockly.Arduino.valueToCode(
	      block, 'DELAY_TIME_MILI', Blockly.Arduino.ORDER_ATOMIC) || '0';
	//delayTime = Math.round(delayTime);
	return 'Kniwwelino.sleep((unsigned long) ' + delayTime + ');\n' ;
};

Blockly.Arduino['kniwwelino_sleepsec'] = function(block) {
	kniwwelinoBaseCode();
	var delayTime = Blockly.Arduino.valueToCode(
	      block, 'DELAY_TIME_SEC', Blockly.Arduino.ORDER_ATOMIC) || '0';
	//delayTime = Math.round(delayTime * 1000);
	return 'Kniwwelino.sleep((unsigned long) (' + delayTime+ '*1000) );\n' ;
};

Blockly.Arduino['kniwwelino_getTime'] = function(block) {
	kniwwelinoBaseCode();
	var value = block.getFieldValue('FORMAT');
	var codeStr = "";
	if (value == 'DATETIME')  {
		codeStr = 'Kniwwelino.getTime()';
	} else if (value == 'DATE')  {
		codeStr = 'String("") + (day()<10?"0":"") + day() + "." + (month()<10?"0":"") + month() + "." + year()';
	} else if (value == 'TIME')  {
		codeStr = 'String("") + (hour()<10?"0":"") + hour() + ":" + (minute()<10?"0":"") + minute() + ":" + (second()<10?"0":"") + second()';
	} else if (value == 'HOUR')  {
		codeStr = 'String(hour())';
	} else if (value == 'MINUTE')  {
		codeStr = 'String(minute())';
	} else if (value == 'SECOND')  {
		codeStr = 'String(second())';
	}
	return [codeStr, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['kniwwelino_getTimeInt'] = function(block) {
	kniwwelinoBaseCode();
	var value = block.getFieldValue('FORMAT');
	var codeStr = "";
	if (value == 'YEAR')  {
		codeStr = 'year()';
	} else if (value == 'MONTH')  {
		codeStr = 'month()';
	} else if (value == 'DAY')  {
		codeStr = 'day()';
	} else if (value == 'HOUR')  {
		codeStr = 'hour()';
	} else if (value == 'MINUTE')  {
		codeStr = 'minute()';
	} else if (value == 'SECOND')  {
		codeStr = 'second()';
	}
	return [codeStr, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['kniwwelino_PINsetEffect'] = function(block) {
	kniwwelinoBaseCode();

	var pin = block.getFieldValue('PIN');
	Blockly.Arduino.reservePin(block, pin, Blockly.Arduino.PinTypes.OUTPUT, 'Digital Write');

	var pinSetupCode = 'pinMode(' + pin + ', OUTPUT);';
	Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);

	return 'Kniwwelino.PINsetEffect(' + pin + ', ' +
		 block.getFieldValue('EFFECT') + ');\n';
};

Blockly.Arduino['kniwwelino_PINbuttonDown'] = function(block) {
	kniwwelinoBaseCode();

	var pin = block.getFieldValue('PIN');
	Blockly.Arduino.reservePin(block, pin, Blockly.Arduino.PinTypes.INPUT, 'Digital Read');

	var pinSetupCode = 'Kniwwelino.PINenableButton(' + pin + ');';
	Blockly.Arduino.addSetup('ioButton_' + pin, pinSetupCode, false);

	var pin = block.getFieldValue('PIN');
	return ['Kniwwelino.PINbuttonDown('+pin+')', Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['kniwwelino_PINbuttonClicked'] = function(block) {
	kniwwelinoBaseCode();

	var pin = block.getFieldValue('PIN');
	Blockly.Arduino.reservePin(block, pin, Blockly.Arduino.PinTypes.INPUT, 'Digital Read');

	var pinSetupCode = 'Kniwwelino.PINenableButton(' + pin + ');';
	Blockly.Arduino.addSetup('ioButton_' + pin, pinSetupCode, false);

	var button = block.getFieldValue('BUTTON');
	var pin = block.getFieldValue('PIN');
	return ['Kniwwelino.PINbuttonClicked('+pin+')', Blockly.Arduino.ORDER_ATOMIC];
};


//==== RGB LED  functions ====================================================

Blockly.Arduino['kniwwelino_RGBselectColor'] = function(block) {
	kniwwelinoBaseCode();
	return ['"'+block.getFieldValue('COLOR').replace("#","").toUpperCase()+'"', Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['kniwwelino_RGBselectEffect'] = function(block) {
	kniwwelinoBaseCode();
	var color = Blockly.Arduino.valueToCode(block, 'COLOR', Blockly.Arduino.ORDER_UNARY_POSTFIX).replace('"',"").replace('"',"");
	var effect = block.getFieldValue('EFFECT');
	var duration = Blockly.Arduino.valueToCode(block, 'DURATION', Blockly.Arduino.ORDER_UNARY_POSTFIX);
	if (duration <=0) duration = -1;
	return ['"'+color+':'+effect+':'+duration+'"', Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['kniwwelino_RGBsetRGB'] = function(block) {
	kniwwelinoBaseCode();
	var r = Blockly.Arduino.valueToCode(block, 'RED', Blockly.Arduino.ORDER_ATOMIC);
	var g = Blockly.Arduino.valueToCode(block, 'GREEN', Blockly.Arduino.ORDER_ATOMIC);
	var b = Blockly.Arduino.valueToCode(block, 'BLUE', Blockly.Arduino.ORDER_ATOMIC);

	return ['Kniwwelino.RGBcolor2Hex('+r+', '+g+', '+b+')', Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['kniwwelino_RGBsetColorEffect'] = function(block) {
	kniwwelinoBaseCode();
	var color = Blockly.Arduino.valueToCode(block, 'COLOR', Blockly.Arduino.ORDER_UNARY_POSTFIX);
	return 'Kniwwelino.RGBsetColorEffect(String(' + color + '), ' +
		 block.getFieldValue('EFFECT') + ', -1' +');\n';
};

Blockly.Arduino['kniwwelino_RGBsetEffect'] = function(block) {
	kniwwelinoBaseCode();
	return 'Kniwwelino.RGBsetEffect(' + block.getFieldValue('EFFECT') + ', -1' +');\n';
};

Blockly.Arduino['kniwwelino_RGBsetColorFromString'] = function(block) {
	kniwwelinoBaseCode();
	var color = Blockly.Arduino.valueToCode(block, 'COLOR', Blockly.Arduino.ORDER_UNARY_POSTFIX);
	return  'Kniwwelino.RGBsetColorEffect(String('+color+'));\n';
};

Blockly.Arduino['kniwwelino_RGBsetBrightness'] = function(block) {
	kniwwelinoBaseCode();
	var brightness = block.getFieldValue('BRIGHTNESS');
	return  'Kniwwelino.RGBsetBrightness(' + brightness + ');\n';
};


Blockly.Arduino['kniwwelino_RGBsetBrightnessFromVariable'] = function(block) {
	kniwwelinoBaseCode();
	var brightness = Blockly.Arduino.valueToCode(
		      block, 'BRIGHTNESS', Blockly.Arduino.ORDER_ATOMIC) || '0';
	// brightness = Math.round(brightness);
	return  'Kniwwelino.RGBsetBrightness((int)' + brightness + ');\n';
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
			//console.log("LED to read: " + led);
			if (block.getFieldValue(led) == "TRUE") {
				pixels = pixels.concat('1');
			} else {
				pixels = pixels.concat('0');
			}
		}
	}
	return ['String("B' + pixels +'")', Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['kniwwelino_MATRIXdrawIconChooser'] = function(block) {
	kniwwelinoBaseCode();
	var icon = block.getFieldValue('ICON');
	return 'Kniwwelino.MATRIXdrawIcon(' + icon + ');\n';
};

Blockly.Arduino['kniwwelino_MATRIXIconChooser'] = function(block) {
	kniwwelinoBaseCode();
	var icon = block.getFieldValue('ICON_CHOOSER');
	return [icon, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['kniwwelino_MATRIXdrawIcon'] = function(block) {
	kniwwelinoBaseCode();
	var icon =  Blockly.Arduino.valueToCode(block, 'ICON', Blockly.Arduino.ORDER_UNARY_POSTFIX);
	if (icon == '') icon = 'String("")';
	return 'Kniwwelino.MATRIXdrawIcon(' + icon + ');\n';
};

Blockly.Arduino['kniwwelino_MATRIXselectIconEffect'] = function(block) {
	kniwwelinoBaseCode();
	var icon = Blockly.Arduino.valueToCode(block, 'ICON', Blockly.Arduino.ORDER_UNARY_POSTFIX).replace('String(',"").replace(')',"").replace('"',"").replace('"',"");
	var effect = block.getFieldValue('EFFECT');
	var duration = Blockly.Arduino.valueToCode(block, 'DURATION', Blockly.Arduino.ORDER_UNARY_POSTFIX);
	if (duration <=0) duration = -1;
	return ['"'+icon+':'+effect+':'+duration+'"', Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['kniwwelino_MATRIXwrite'] = function(block) {
	kniwwelinoBaseCode();
	var text = Blockly.Arduino.valueToCode(block, 'TEXT', Blockly.Arduino.ORDER_UNARY_POSTFIX);
	var type = block.getFieldValue('TYPE');
	if (type == "SCROLL") {
		return 'Kniwwelino.MATRIXwrite(String(' + text + '));\n';
	} else if (type == "WAIT") {
		return 'Kniwwelino.MATRIXwriteAndWait(String(' + text + '));\n';
	} else if (type == "ONCE") {
		return 'Kniwwelino.MATRIXwriteOnce(String(' + text + '));\n';
	}
};

Blockly.Arduino['kniwwelino_MATRIXdrawPixel'] = function(block) {
	kniwwelinoBaseCode();
	var x = Blockly.Arduino.valueToCode(block, 'X', Blockly.Arduino.ORDER_UNARY_POSTFIX);
	var y = Blockly.Arduino.valueToCode(block, 'Y', Blockly.Arduino.ORDER_UNARY_POSTFIX);
	var state = Blockly.Arduino.valueToCode(block, 'STATE', Blockly.Arduino.ORDER_UNARY_POSTFIX);

	return 'Kniwwelino.MATRIXsetPixel(' + x + ', ' + y + ', ' + state + ');\n';
};

Blockly.Arduino['kniwwelino_MATRIXreadPixel'] = function(block) {
	kniwwelinoBaseCode();
	var x = Blockly.Arduino.valueToCode(block, 'X', Blockly.Arduino.ORDER_UNARY_POSTFIX);
	var y = Blockly.Arduino.valueToCode(block, 'Y', Blockly.Arduino.ORDER_UNARY_POSTFIX);

	return 'Kniwwelino.MATRIXgetPixel(' + x + ', ' + y + ')';
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
		return ['Kniwwelino.BUTTONABclicked()', Blockly.Arduino.ORDER_ATOMIC];
	} else if (button == 'AorB')  {
		return ['Kniwwelino.BUTTONAclicked() || Kniwwelino.BUTTONBclicked()', Blockly.Arduino.ORDER_ATOMIC];
	} else {
		return ['Kniwwelino.BUTTON'+button+'clicked()', Blockly.Arduino.ORDER_ATOMIC];
	}
};

//==== MQTT functions ==============================================

Blockly.Arduino['kniwwelino_MQTTsetGroup'] = function(block) {
	kniwwelinoBaseCode();
	var group = block.getFieldValue('GROUP');
	group = group.trim().replace(" ","_");
	Blockly.Arduino.addSetup('kniwwelino_MQTTsetGroup','Kniwwelino.MQTTsetGroup(String("' + group + '"));', true);
	return '';
};

Blockly.Arduino['kniwwelino_MQTTconnectRGB'] = function(block) {
	kniwwelinoBaseCode();
	Blockly.Arduino.addSetup('Kniwwelino.MQTTconnectRGB', 'Kniwwelino.MQTTconnectRGB();', true);
	return  '';
}

Blockly.Arduino['kniwwelino_MQTTconnectMATRIX'] = function(block) {
	kniwwelinoBaseCode();
	Blockly.Arduino.addSetup('Kniwwelino.MQTTconnectMATRIX', 'Kniwwelino.MQTTconnectMATRIX();', true);
	return  '';
}

Blockly.Arduino['kniwwelino_MQTTpublishSimple'] = function(block) {
	kniwwelinoBaseCode();
	var topic = block.getFieldValue('TOPIC');
	topic = topic.trim().replace(" ","_");
	var message = Blockly.Arduino.valueToCode(block, 'MESSAGE',Blockly.Arduino.ORDER_UNARY_POSTFIX);
	return  'Kniwwelino.MQTTpublish("'+topic+'", String('+message+'));\n';
};

Blockly.Arduino['kniwwelino_MQTTsubscribe'] = function(block) {
	kniwwelinoBaseCode();
	kniwwelinoMQTTCode();
	var topic = Blockly.Arduino.valueToCode(block, 'TOPIC',Blockly.Arduino.ORDER_UNARY_POSTFIX);
	topic = topic.trim().replace(" ","_");
	var varName = Blockly.Arduino.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);

	Blockly.Arduino.addKniwwelinoSub(varName, topic);
	Blockly.Arduino.addSetup('kniwwelino_MQTTsubscribe'+topic,'Kniwwelino.MQTTsubscribe(' + topic + ');', true);
	return '';
};

Blockly.Arduino['kniwwelino_MQTTsubscribePublic'] = function(block) {
	kniwwelinoBaseCode();
	kniwwelinoMQTTCode();
	var topic = Blockly.Arduino.valueToCode(block, 'TOPIC',Blockly.Arduino.ORDER_UNARY_POSTFIX);
	topic = topic.trim().replace(" ","_");
	var varName = Blockly.Arduino.variableDB_.getName(block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);

	Blockly.Arduino.addKniwwelinoSub(varName, topic);
	Blockly.Arduino.addSetup('kniwwelino_MQTTsubscribepublic'+topic,'Kniwwelino.MQTTsubscribepublic(' + topic + ');', true);
	return '';
};

Blockly.Arduino['kniwwelino_MQTTpublish'] = function(block) {
	kniwwelinoBaseCode();
	var topic = Blockly.Arduino.valueToCode(block, 'TOPIC',Blockly.Arduino.ORDER_UNARY_POSTFIX);
	topic = topic.trim().replace(" ","_");
	var message = Blockly.Arduino.valueToCode(block, 'MESSAGE',Blockly.Arduino.ORDER_UNARY_POSTFIX);
	return  'Kniwwelino.MQTTpublish('+topic+', String('+message+'));\n';
};


//==== SENSORS ==============================================
Blockly.Arduino['kniwwelino_BME280getValue'] = function(block) {
	kniwwelinoBaseCode();
	Blockly.Arduino.addInclude('Adafruit_Sensor', '#include "Adafruit_Sensor.h"');
	Blockly.Arduino.addInclude('Adafruit_BME280', '#include "Adafruit_BME280.h"');
	Blockly.Arduino.addDeclaration('Adafruit_BME280', 'Adafruit_BME280 bme280;');
	Blockly.Arduino.addSetup('BME280init', 'if(bme280.begin(0x76)) Kniwwelino.logln("BME-280 Sensor Ready"); \n  else Kniwwelino.logln("failed to initialize BME-280 Sensor"); ', true);

	var value = block.getFieldValue('VALUE');
	if (value == 'TEMPERATURE')  {
		return ['bme280.readTemperature()', Blockly.Arduino.ORDER_ATOMIC];
	} else if (value == 'HUMIDITY')  {
		return ['bme280.readHumidity()', Blockly.Arduino.ORDER_ATOMIC];
	} else if (value == 'PRESSURE')  {
		return ['(bme280.readPressure()/100.0F)', Blockly.Arduino.ORDER_ATOMIC];
	} else if (value == 'HEIGHT')  {
		Blockly.Arduino.addDeclaration('Adafruit_BME280SeaLevel', '#define BME280_SEALEVELPRESSURE_HPA (1013.25)');
		return ['bme280.readAltitude(BME280_SEALEVELPRESSURE_HPA)', Blockly.Arduino.ORDER_ATOMIC];
	}
	return ""
};

Blockly.Arduino['kniwwelino_BME680getValue'] = function(block) {
	kniwwelinoBaseCode();
	Blockly.Arduino.addInclude('Adafruit_Sensor', '#include "Adafruit_Sensor.h"');
	Blockly.Arduino.addInclude('Adafruit_BME680', '#include "Adafruit_BME680.h"');
	Blockly.Arduino.addDeclaration('Adafruit_BME680', 'Adafruit_BME680 bme680;');
	Blockly.Arduino.addSetup('BME680init', 'if(bme680.begin(0x77)) Kniwwelino.logln("BME-680 Sensor Ready"); \n  else Kniwwelino.logln("failed to initialize BME-680 Sensor"); ', true);

	var value = block.getFieldValue('VALUE');
	if (value == 'TEMPERATURE')  {
		return ['bme680.readTemperature()', Blockly.Arduino.ORDER_ATOMIC];
	} else if (value == 'HUMIDITY')  {
		return ['bme680.readHumidity()', Blockly.Arduino.ORDER_ATOMIC];
	} else if (value == 'GAS')  {
		return ['bme680.readGas()', Blockly.Arduino.ORDER_ATOMIC];
	} else if (value == 'PRESSURE')  {
		return ['(bme680.readPressure()/100.0F)', Blockly.Arduino.ORDER_ATOMIC];
	} else if (value == 'HEIGHT')  {
		Blockly.Arduino.addDeclaration('Adafruit_BME680SeaLevel', '#define BME680_SEALEVELPRESSURE_HPA (1013.25)');
		return ['bme680.readAltitude(BME680_SEALEVELPRESSURE_HPA)', Blockly.Arduino.ORDER_ATOMIC];
	}
	return ""
};

Blockly.Arduino['kniwwelino_SHT30getValue'] = function(block) {
	kniwwelinoBaseCode();
	Blockly.Arduino.addInclude('SHT3X', '#include <WEMOS_SHT3X.h>');
	Blockly.Arduino.addDeclaration('SHT3X', 'SHT3X sht30(0x45);');
	Blockly.Arduino.addSetup('SHT3Xinit', 'if(sht30.get()==0) Kniwwelino.logln("SHT30 Sensor Ready"); \n  else Kniwwelino.logln("failed to initialize SHT30 Sensor"); ', true);

	var value = block.getFieldValue('VALUE');
	if (value == 'TEMPERATURE')  {
		return ['sht30.readTemperature()', Blockly.Arduino.ORDER_ATOMIC];
	} else if (value == 'HUMIDITY')  {
		return ['sht30.readHumidity()', Blockly.Arduino.ORDER_ATOMIC];
	}
	return ""
};

Blockly.Arduino['kniwwelino_BH1750getLightLevel'] = function(block) {
	kniwwelinoBaseCode();
	Blockly.Arduino.addInclude('BH1750', '#include <BH1750.h>');
	Blockly.Arduino.addDeclaration('BH1750', 'BH1750 bh1750;');
	Blockly.Arduino.addSetup('BH1750init', 'if(bh1750.begin()) Kniwwelino.logln("BH1750 Sensor Ready"); \n  else Kniwwelino.logln("failed to initialize BH1750 Sensor"); ', true);
	return ['bh1750.readLightLevel()', Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['kniwwelino_ADPS9960getValue'] = function(block) {
	kniwwelinoBaseCode();
	Blockly.Arduino.addInclude('Adafruit_APDS9960', '#include "Adafruit_APDS9960.h"');
	Blockly.Arduino.addDeclaration('Adafruit_APDS9960', 'Adafruit_APDS9960 apds9960;');
	Blockly.Arduino.addSetup('APDS9960init', 'if(apds9960.begin()) Kniwwelino.logln("ADPS-9960 Sensor Ready"); \n  else Kniwwelino.logln("failed to initialize ADPS-9960 Sensor"); ', true);

	var value = block.getFieldValue('VALUE');
	if (value == 'PROXIMITY')  {
		Blockly.Arduino.addSetup('APDS9960enableProximity', 'apds9960.enableProximity(true);', true);
		return ['apds9960.readProximity()', Blockly.Arduino.ORDER_ATOMIC];
	} else if (value == 'GESTURE')  {
		Blockly.Arduino.addSetup('APDS9960enableProximity', 'apds9960.enableProximity(true);', true);
		Blockly.Arduino.addSetup('APDS9960enableGesture', 'apds9960.enableGesture(true);', true);
		return ['apds9960.readGesture()', Blockly.Arduino.ORDER_ATOMIC];
	} else if (value == 'WHITE')  {
		Blockly.Arduino.addSetup('APDS9960enableColor', 'apds9960.enableColor(true);', true);
		return ['apds9960.getWhite()', Blockly.Arduino.ORDER_ATOMIC];
	} else if (value == 'RED')  {
		Blockly.Arduino.addSetup('APDS9960enableColor', 'apds9960.enableColor(true);', true);
		return ['apds9960.getRed()', Blockly.Arduino.ORDER_ATOMIC];
	} else if (value == 'GREEN')  {
		Blockly.Arduino.addSetup('APDS9960enableColor', 'apds9960.enableColor(true);', true);
		return ['apds9960.getGreen()', Blockly.Arduino.ORDER_ATOMIC];
	} else if (value == 'BLUE')  {
		Blockly.Arduino.addSetup('APDS9960enableColor', 'apds9960.enableColor(true);', true);
		return ['apds9960.getBlue()', Blockly.Arduino.ORDER_ATOMIC];
	}
	return ""
};

Blockly.Arduino['kniwwelino_HCSR04getValue'] = function(block) {
	kniwwelinoBaseCode();
	Blockly.Arduino.addInclude('HCSR04', '#include <HCSR04.h>');
	Blockly.Arduino.addDeclaration('HCSR04', 'UltraSonicDistanceSensor hcsr04(D0, D5);');
	return ['hcsr04.measureDistanceCm()', Blockly.Arduino.ORDER_ATOMIC];
};

//==== WEATHER ============================================

Blockly.Arduino['kniwwelino_WeatherTopicChooser'] = function(block) {
	var location = block.getFieldValue('LOCATION');
  var weather_par = block.getFieldValue('WEATHER_PAR');

  var code = "\"weather/"+location+"/"+weather_par + "\"";
	return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino['kniwwelino_WeatherConstChooser'] = function(block) {
  var weather_const = '\"'+block.getFieldValue('WEATHER_CONST')+'\"';
	return [weather_const, Blockly.Arduino.ORDER_ATOMIC];
};

//==== AUDIO ==============================================

Blockly.Arduino['kniwwelino_playNote'] = function(block) {
	  var pin = block.getFieldValue('TONEPIN');
	  var freq = Blockly.Arduino.valueToCode(block, 'NOTE', Blockly.Arduino.ORDER_ATOMIC);
	  var dur  = Blockly.Arduino.valueToCode(block, 'NOTE_DURATION', Blockly.Arduino.ORDER_ATOMIC);
	  Blockly.Arduino.reservePin(
	      block, pin, Blockly.Arduino.PinTypes.OUTPUT, 'Tone Pin');

	  var pinSetupCode = 'pinMode(' + pin + ', OUTPUT);\n';
	  Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);

	  var code = 'Kniwwelino.playNote(' + pin + ', ' + freq + ', ' + dur + ');\n';
	  return code;
	};

Blockly.Arduino['kniwwelino_playTone'] = function(block) {
	  var pin = block.getFieldValue('TONEPIN');
	  var freq = Blockly.Arduino.valueToCode(block, 'NOTE', Blockly.Arduino.ORDER_ATOMIC);
	  Blockly.Arduino.reservePin(
	      block, pin, Blockly.Arduino.PinTypes.OUTPUT, 'Tone Pin');

	  var pinSetupCode = 'pinMode(' + pin + ', OUTPUT);\n';
	  Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);

	  var code = 'Kniwwelino.playTone(' + pin + ', ' + freq + ');\n';
	  return code;
	};


Blockly.Arduino['kniwwelino_toneOff'] = function(block) {
	  var pin = block.getFieldValue("TONEPIN");
	  Blockly.Arduino.reservePin(
	      block, pin, Blockly.Arduino.PinTypes.OUTPUT, 'Tone Pin');

	  var pinSetupCode = 'pinMode(' + pin + ', OUTPUT);\n';
	  Blockly.Arduino.addSetup('io_' + pin, pinSetupCode, false);

	  var code = 'Kniwwelino.toneOff(' + pin + ');\n';
	  return code;
	};


Blockly.Arduino['kniwwelino_toneChooser'] = function(block) {
		kniwwelinoBaseCode();
		var freq = block.getFieldValue('NOTE');
		return [freq, Blockly.Arduino.ORDER_ATOMIC];
	};


//==== Neopixel WS2812 ==============================================

	Blockly.Arduino['kniwwelino_neopixelInit'] = function(block) {
		kniwwelinoBaseCode();
		var size = block.getFieldValue('SIZE');
		var pin = block.getFieldValue('PIN');
		Blockly.Arduino.addInclude('WS2812FX', '#include <WS2812FX.h>');
		Blockly.Arduino.addDeclaration('kniwwelino_WS2812FXinit','WS2812FX ws2812fx = WS2812FX('+size+', '+pin+', NEO_GRB + NEO_KHZ800);');
		Blockly.Arduino.addSetup('kniwwelino_WS2812FXsetup', 'ws2812fx.init();\n  ws2812fx.setBrightness(100);\n  ws2812fx.setSpeed(200);\n  ws2812fx.start();', true);
		Blockly.Arduino.addSetup('kniwwelino_WS2812FXsetup', '//initialize neopixel strip\n  ws2812fx.init();\n//  ws2812fx.setBrightness(100);\n//  ws2812fx.setSpeed(200);\n  ws2812fx.start();', true);

		return '';
	};

	Blockly.Arduino['kniwwelino_neopixelSetEffect'] = function(block) {
		kniwwelinoBaseCode();
		var effect = Blockly.Arduino.valueToCode(block, 'EFFECT', Blockly.Arduino.ORDER_UNARY_POSTFIX);
		if (effect == null || effect === undefined || effect == "") effect = 0;

		var code = 'ws2812fx.setMode(' + effect + '); ws2812fx.start();\n';
		return code;
	};

	Blockly.Arduino['kniwwelino_neopixelEffectChooser'] = function(block) {
			kniwwelinoBaseCode();
			var effect = block.getFieldValue('EFFECT');
			return [effect, Blockly.Arduino.ORDER_ATOMIC];
	};


	Blockly.Arduino['kniwwelino_neopixelsetStripColorFromString'] = function(block) {
		kniwwelinoBaseCode();
		var color = Blockly.Arduino.valueToCode(block, 'COLOR', Blockly.Arduino.ORDER_UNARY_POSTFIX);
		if (color == null || color === undefined || color == "") color = 0;

		var code = 'ws2812fx.setColor(Kniwwelino.RGBhex2int(' + color + '));\n';
		return code;
	};

	Blockly.Arduino['kniwwelino_neopixelsetPixelColorFromString'] = function(block) {
		kniwwelinoBaseCode();

		var pixel = Blockly.Arduino.valueToCode(block, 'PIXEL', Blockly.Arduino.ORDER_UNARY_POSTFIX);
		if (pixel == null || pixel === undefined || pixel == "") pixel = 0;

		var color = Blockly.Arduino.valueToCode(block, 'COLOR', Blockly.Arduino.ORDER_UNARY_POSTFIX);
		if (color == null || color === undefined || color == "") color = 0;

		var code = 'if(ws2812fx.isRunning()){ws2812fx.stop();} ws2812fx.setPixelColor('+pixel+', Kniwwelino.RGBhex2int(' + color + ')); ws2812fx.show();\n';
		return code;
	};

	Blockly.Arduino['kniwwelino_neopixelsetSpeed'] = function(block) {
		kniwwelinoBaseCode();
		var speed = Blockly.Arduino.valueToCode(block, 'SPEED', Blockly.Arduino.ORDER_UNARY_POSTFIX);
		return  'ws2812fx.setSpeed(' + speed + ');\n';
	};

	Blockly.Arduino['kniwwelino_neopixelsetBrightness'] = function(block) {
		kniwwelinoBaseCode();
		var brightness = Blockly.Arduino.valueToCode(block, 'BRIGHTNESS', Blockly.Arduino.ORDER_UNARY_POSTFIX);
		return  'ws2812fx.setBrightness(' + brightness + ');\n';
	};
