/**
 * @license Licensed under the Apache License, Version 2.0 (the "License"):
 *          http://www.apache.org/licenses/LICENSE-2.0
 *
 * @fileoverview General javaScript for Arduino app with material design.
 */
'use strict';

/** Create a namespace for the application. */
var Ardublockly = Ardublockly || {};

/** Initialize function for Ardublockly, to be called on page load. */
Ardublockly.init = function() {
  // Lang init must run first for the rest of the page to pick the right msgs
  Ardublockly.initLanguage();

  // Inject Blockly into content_blocks and fetch additional blocks
  Ardublockly.injectBlockly(document.getElementById('content_blocks'),
                            Ardublockly.TOOLBOX_XML, '../blockly/');

  Ardublockly.designJsInit();
  Ardublockly.initialiseIdeButtons();

  Ardublockly.bindDesignEventListeners();
  Ardublockly.bindActionFunctions();
  Ardublockly.bindBlocklyEventListeners();

  Blockly.HSV_SATURATION =  0.87; //0.70;
  Blockly.HSV_VALUE = 0.83; //0.47; //0.70;
};

/** Binds functions to each of the buttons, nav links, and related. */
Ardublockly.bindActionFunctions = function() {
  // Navigation buttons
  Ardublockly.bindClick_('button_load', Ardublockly.loadUserXmlFile);
  Ardublockly.bindClick_('button_save', Ardublockly.saveXmlFile);
  Ardublockly.bindClick_('button_delete', Ardublockly.discardAllBlocks);

  // Floating buttons
  Ardublockly.bindClick_('button_ide_large', function() {
		console.log('Button Event: Upload Arduino code to server');
    Ardublockly.ideSendUpload();
  });
  Ardublockly.bindClick_('button_load_xml', Ardublockly.XmlTextareaToBlocks);
	Ardublockly.bindClick_('download_arduino', Ardublockly.saveSketchFile);
  Ardublockly.bindClick_('button_toggle_toolbox', Ardublockly.toogleToolbox);

  Ardublockly.bindClick_('expandCodeButtons', Ardublockly.toggleSourceCodeVisibility);
	Ardublockly.bindClick_('button_manageKniwwelino', Ardublockly.renderKniwwelinosModal)
};

/** Sets the Ardublockly server IDE setting to upload and sends the code. */
Ardublockly.ideSendUpload = function() {
  Ardublockly.shortMessage(Ardublockly.getLocalStr('uploadingSketch'));
  Ardublockly.resetIdeOutputContent();
  Ardublockly.sendCode();
};

/** Initialises the IDE buttons with the default option from the server. */
Ardublockly.initialiseIdeButtons = function() {
  document.getElementById('button_ide_large').title =
      Ardublockly.getLocalStr('uploadSketch');
};

/**
 * Loads an XML file from the server and replaces the current blocks into the
 * Blockly workspace.
 * @param {!string} xmlFile Server location of the XML file to load.
 */
Ardublockly.loadServerXmlFile = function(xmlFile) {
  var loadXmlfileAccepted = function() {
    // loadXmlBlockFile loads the file asynchronously and needs a callback
    var loadXmlCb = function(sucess) {
      if (sucess) {
        Ardublockly.renderContent();
      } else {
        Ardublockly.alertMessage(
            Ardublockly.getLocalStr('invalidXmlTitle'),
            Ardublockly.getLocalStr('invalidXmlBody'),
            false);
      }
    };
    Ardublockly.loadXmlBlockFile(xmlFile, loadXmlCb, connectionErrorCb);
  };

  if (Ardublockly.isWorkspaceEmpty()) {
    loadXmlfileAccepted();
  } else {
    Ardublockly.alertMessage(
        Ardublockly.getLocalStr('loadNewBlocksTitle'),
        Ardublockly.getLocalStr('loadNewBlocksBody'),
        true, loadXmlfileAccepted);
  }
};

/**
 * Loads an XML file from the users file system and adds the blocks into the
 * Blockly workspace.
 */
Ardublockly.loadUserXmlFile = function() {
  // Create File Reader event listener function
  var parseInputXMLfile = function(e) {
    var xmlFile = e.target.files[0];
    var filename = xmlFile.name;
    var extensionPosition = filename.lastIndexOf('.');
    if (extensionPosition !== -1) {
      filename = filename.substr(0, extensionPosition);
    }

    var reader = new FileReader();
    reader.onload = function() {
      var success = Ardublockly.replaceBlocksfromXml(reader.result);
      if (success) {
        Ardublockly.renderContent();
        Ardublockly.sketchNameSet(filename);
      } else {
        Ardublockly.alertMessage(
            Ardublockly.getLocalStr('invalidXmlTitle'),
            Ardublockly.getLocalStr('invalidXmlBody'),
            false);
      }
    };
    reader.readAsText(xmlFile);
  };

  // Create once invisible browse button with event listener, and click it
  var selectFile = document.getElementById('select_file');
  if (selectFile === null) {
    var selectFileDom = document.createElement('INPUT');
    selectFileDom.type = 'file';
    selectFileDom.id = 'select_file';

    var selectFileWrapperDom = document.createElement('DIV');
    selectFileWrapperDom.id = 'select_file_wrapper';
    selectFileWrapperDom.style.display = 'none';
    selectFileWrapperDom.appendChild(selectFileDom);

    document.body.appendChild(selectFileWrapperDom);
    selectFile = document.getElementById('select_file');
    selectFile.addEventListener('change', parseInputXMLfile, false);
  }
  selectFile.click();
};

/**
 * Creates an XML file containing the blocks from the Blockly workspace and
 * prompts the users to save it into their local file system.
 */
Ardublockly.saveXmlFile = function() {
  Ardublockly.saveTextFileAs(
      document.getElementById('sketch_name').value + '.xml',
      Ardublockly.generateXml());
};

/**
 * Creates an Arduino Sketch file containing the Arduino code generated from
 * the Blockly workspace and prompts the users to save it into their local file
 * system.
 */
Ardublockly.saveSketchFile = function() {
  Ardublockly.saveTextFileAs(
      document.getElementById('sketch_name').value + '.ino',
      Ardublockly.generateArduino());
};

/**
 * Creates an text file with the input content and files name, and prompts the
 * users to save it into their local file system.
 * @param {!string} fileName Name for the file to be saved.
 * @param {!string} content Text datd to be saved in to the file.
 */
Ardublockly.saveTextFileAs = function(fileName, content) {
  var blob = new Blob([content], {type: 'text/plain;charset=utf-8'});
  saveAs(blob, fileName);
};

Ardublockly.renderKniwwelinosModal = function() {
	var kniwwelinoLocalStorage = localStorage.getItem("kniwwelinos");
	if (!kniwwelinoLocalStorage) {
		return;
	}

	var kniwwelinoJSON = JSON.parse(kniwwelinoLocalStorage);
	var kniwwelinos = document.getElementById('listKniwwelinosModal').value;
	kniwwelinos = '';
	kniwwelinos += `You are managing: ${kniwwelinoJSON.length} Kniwwelinos`;

	kniwwelinos += '<ul class="collection">';

	for (var i = 0; i < kniwwelinoJSON.length; i++) {
		kniwwelinos += '<li class="collection-item avatar">';
		kniwwelinos += '<img src="img/mascot.png" alt="" class="circle">';
		kniwwelinos += `<span class="title">${kniwwelinoJSON[i].name}</span><br>`;
		kniwwelinos += `<span class="id">${kniwwelinoJSON[i].id}</span><br>`;
		kniwwelinos += `<span class="mac">${kniwwelinoJSON[i].mac}</span>`;
		kniwwelinos += '<a href="#!" class="btn-floating btn secondary-content"><i class="mdi-content-remove-circle-outline red"></i></a>';
		kniwwelinos += '</li>';
	}
	kniwwelinos += '</ul>';

	kniwwelinos += '<ul class="collection">';
	kniwwelinos += '<li class="collection-item avatar">';
	kniwwelinos += '<img src="img/mascot.png" alt="" class="circle">';
	kniwwelinos += `<span class="title">Name</span><br>`;
	kniwwelinos += `<span class="id">ID</span><br>`;
	kniwwelinos += `<span class="mac">MAC</span>`;
	kniwwelinos += '<a href="#!" class="btn-floating btn secondary-content"><i class="mdi-content-add-circle-outline green"></i></a>';
	kniwwelinos += '</li>';

	kniwwelinos += '</ul>';

	document.getElementById('listKniwwelinosModal').innerHTML = kniwwelinos;
};

/**
 * Sets the compiler location form data retrieve from an updated element.
 * @param {element} jsonResponse JSON data coming back from the server.
 * @return {undefined} Might exit early if response is null.
 */
Ardublockly.setCompilerLocationHtml = function(newEl) {

  var compLocIp = document.getElementById('settings_compiler_location');
  if (compLocIp != null) {
    compLocIp.value = newEl.value || compLocIp.value ||
        'Please enter the location of the Arduino IDE executable';
    compLocIp.style.cssText = newEl.style.cssText;
  }
};

/**
 * Sets the sketch location form data retrieve from an updated element.
 * @param {element} jsonResponse JSON data coming back from the server.
 * @return {undefined} Might exit early if response is null.
 */
Ardublockly.setSketchLocationHtml = function(newEl) {

  var sketchLocIp = document.getElementById('settings_sketch_location');
  if (sketchLocIp != null) {
    sketchLocIp.value = newEl.value || sketchLocIp.value ||
        'Please enter a folder to store the Arduino Sketch';
    sketchLocIp.style.cssText = newEl.style.cssText;
  }
};

/**
 * Replaces the Arduino Boards form data with a new HTMl element.
 * Ensures there is a change listener to call 'setSerialPort' function
 * @param {element} jsonObj JSON data coming back from the server.
 * @return {undefined} Might exit early if response is null.
 */
Ardublockly.setArduinoBoardsHtml = function(newEl) {

  var boardDropdown = document.getElementById('board');
  if (boardDropdown !== null) {
    // Restarting the select elements built by materialize
    $('select').material_select('destroy');
    newEl.name = 'settings_board';
    newEl.id = 'board';
    newEl.onchange = Ardublockly.setBoard;
    boardDropdown.parentNode.replaceChild(newEl, boardDropdown);
    // Refresh the materialize select menus
    $('select').material_select();
  }
};

/**
 * Sets the Arduino Board type with the selected user input from the drop down.
 */
Ardublockly.setBoard = function() {
  var el = document.getElementById('board');
  var boardValue = el.options[el.selectedIndex].value;
  ArdublocklyServer.setArduinoBoard(boardValue, function(jsonObj) {
    var newEl = ArdublocklyServer.jsonToHtmlDropdown(jsonObj);
    Ardublockly.setArduinoBoardsHtml(newEl);
  });
  Ardublockly.changeBlocklyArduinoBoard(
      boardValue.toLowerCase().replace(/ /g, '_'));
};

/**
 * Replaces the Serial Port form data with a new HTMl element.
 * Ensures there is a change listener to call 'setSerialPort' function
 * @param {element} jsonResponse JSON data coming back from the server.
 * @return {undefined} Might exit early if response is null.
 */
Ardublockly.setSerialPortsHtml = function(newEl) {

  var serialDropdown = document.getElementById('serial_port');
  if (serialDropdown !== null) {
    // Restarting the select elements built by materialize
    $('select').material_select('destroy');
    newEl.name = 'settings_serial';
    newEl.id = 'serial_port';
    newEl.onchange = Ardublockly.setSerial;
    serialDropdown.parentNode.replaceChild(newEl, serialDropdown);
    // Refresh the materialize select menus
    $('select').material_select();
  }
};

/** Sets the Serial Port with the selected user input from the drop down. */
Ardublockly.setSerial = function() {
  var el = document.getElementById('serial_port');
  var serialValue = el.options[el.selectedIndex].value;
  ArdublocklyServer.setSerialPort(serialValue, function(jsonObj) {
    var newEl = ArdublocklyServer.jsonToHtmlDropdown(jsonObj);
    Ardublockly.setSerialPortsHtml(newEl);
  });
};

/**
 * Replaces IDE options form data with a new HTMl element.
 * Ensures there is a change listener to call 'setIdeSettings' function
 * @param {element} jsonResponse JSON data coming back from the server.
 * @return {undefined} Might exit early if response is null.
 */
Ardublockly.setIdeHtml = function(newEl) {

  var ideDropdown = document.getElementById('ide_settings');
  if (ideDropdown !== null) {
    // Restarting the select elements built by materialize
    $('select').material_select('destroy');
    newEl.name = 'settings_ide';
    newEl.id = 'ide_settings';
    newEl.onchange = Ardublockly.setIdeSettings;
    ideDropdown.parentNode.replaceChild(newEl, ideDropdown);
    // Refresh the materialize select menus
    $('select').material_select();
  }
};


/**
 * Send the Arduino Code to the ArdublocklyServer to process.
 * Shows a loader around the button, blocking it (unblocked upon received
 * message from server).
 */
Ardublockly.sendCode = function() {
  Ardublockly.largeIdeButtonSpinner(true);

  /**
   * Receives the IDE data back to be displayed and stops spinner.
   * @param {element} jsonResponse JSON data coming back from the server.
   * @return {undefined} Might exit early if response is null.
   */
  var sendCodeReturn = function(jsonObj) {
    Ardublockly.largeIdeButtonSpinner(false);
    var dataBack = ArdublocklyServer.jsonToIdeModal(jsonObj);
    Ardublockly.arduinoIdeOutput(dataBack);
  };

  ArdublocklyServer.sendSketchToServer(
      Ardublockly.generateArduino(), document.getElementById('sketch_name').value, sendCodeReturn);
};

/** Populate the workspace blocks with the XML written in the XML text area. */
Ardublockly.XmlTextareaToBlocks = function() {
  var success = Ardublockly.replaceBlocksfromXml(
      document.getElementById('content_xml').value);
  if (success) {
    Ardublockly.renderContent();
  } else {
    Ardublockly.alertMessage(
        Ardublockly.getLocalStr('invalidXmlTitle'),
        Ardublockly.getLocalStr('invalidXmlBody'),
        false);
  }
};

Ardublockly.toggleSourceCodeVisibility = function() {
  if (document.getElementById('codesidebar').style.visibility == "hidden") {
    document.getElementById('blocks_workspace').style.width = "65%";
    document.getElementById('codesidebar').style.visibility = "visible";
  } else {
    document.getElementById('blocks_workspace').style.width = "100%";
    document.getElementById('codesidebar').style.visibility = "hidden";
  }
   Ardublockly.contentWidthToggle();
}

/**
 * Private variable to save the previous version of the Arduino Code.
 * @type {!String}
 * @private
 */
Ardublockly.PREV_ARDUINO_CODE_ = 'void setup() {\n\n}\n\n\nvoid loop() {\n\n}';

/**
 * Populate the Arduino Code and Blocks XML panels with content generated from
 * the blocks.
 */
Ardublockly.renderContent = function() {
  // Render Arduino Code with latest change highlight and syntax highlighting
  var arduinoCode = Ardublockly.generateArduino();
  if (arduinoCode !== Ardublockly.PREV_ARDUINO_CODE_) {
    var diff = JsDiff.diffWords(Ardublockly.PREV_ARDUINO_CODE_, arduinoCode);
    var resultStringArray = [];
    for (var i = 0; i < diff.length; i++) {
      if (!diff[i].removed) {
        var escapedCode = diff[i].value.replace(/</g, '&lt;')
                                       .replace(/>/g, '&gt;');
        if (diff[i].added) {
          resultStringArray.push(
              '<span class="code_highlight_new">' + escapedCode + '</span>');
        } else {
          resultStringArray.push(escapedCode);
        }
      }
    }
    document.getElementById('content_arduino').innerHTML =
        prettyPrintOne(resultStringArray.join(''), 'cpp', false);
    Ardublockly.PREV_ARDUINO_CODE_ = arduinoCode;
  }

  // Generate plain XML into element
  document.getElementById('content_xml').value = Ardublockly.generateXml();
};

/**
 * Private variable to indicate if the toolbox is meant to be shown.
 * @type {!boolean}
 * @private
 */
Ardublockly.TOOLBAR_SHOWING_ = true;

/**
 * Toggles the blockly toolbox and the Ardublockly toolbox button On and Off.
 * Uses namespace member variable TOOLBAR_SHOWING_ to toggle state.
 */
Ardublockly.toogleToolbox = function() {
  if (Ardublockly.TOOLBAR_SHOWING_) {
    Ardublockly.blocklyCloseToolbox();
    Ardublockly.displayToolbox(false);
  } else {
    Ardublockly.displayToolbox(true);
  }
  Ardublockly.TOOLBAR_SHOWING_ = !Ardublockly.TOOLBAR_SHOWING_;
};

/** @return {boolean} Indicates if the toolbox is currently visible. */
Ardublockly.isToolboxVisible = function() {
  return Ardublockly.TOOLBAR_SHOWING_;
};

/** Informs the user that the selected function is not yet implemented. */
Ardublockly.functionNotImplemented = function() {
  Ardublockly.shortMessage('Function not yet implemented');
};

/**
 * Interface to display messages with a possible action.
 * @param {!string} title HTML to include in title.
 * @param {!element} body HTML to include in body.
 * @param {boolean=} confirm Indicates if the user is shown a single option (ok)
 *     or an option to cancel, with an action applied to the "ok".
 * @param {string=|function=} callback If confirm option is selected this would
 *     be the function called when clicked 'OK'.
 */
Ardublockly.alertMessage = function(title, body, confirm, callback) {
  Ardublockly.materialAlert(title, body, confirm, callback);
};

/**
 * Interface to displays a short message, which disappears after a time out.
 * @param {!string} message Text to be temporarily displayed.
 */
Ardublockly.shortMessage = function(message) {
  Ardublockly.MaterialToast(message);
};

/**
 * Bind a function to a button's click event.
 * On touch enabled browsers, ontouchend is treated as equivalent to onclick.
 * @param {!Element|string} el Button element or ID thereof.
 * @param {!function} func Event handler to bind.
 * @private
 */
Ardublockly.bindClick_ = function(el, func) {
  if (typeof el == 'string') {
    el = document.getElementById(el);
  }
  // Need to ensure both, touch and click, events don't fire for the same thing
  var propagateOnce = function(e) {
    e.stopPropagation();
    e.preventDefault();
    func();
  };
  el.addEventListener('ontouchend', propagateOnce);
  el.addEventListener('click', propagateOnce);
};
