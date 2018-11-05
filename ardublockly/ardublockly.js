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
  Ardublockly.toogleToolboxSimple();


  Ardublockly.designJsInit();
  Ardublockly.initialiseIdeButtons();
	Ardublockly.initKniwwelinoList();

  Ardublockly.bindDesignEventListeners();
  Ardublockly.bindActionFunctions();
  Ardublockly.bindBlocklyEventListeners();

  Blockly.HSV_SATURATION =  0.87; //0.70;
  Blockly.HSV_VALUE = 0.83; //0.47; //0.70;

	document.getElementById('sketch_name').addEventListener(
		'keyup', function() {
			Ardublockly.renderContent();
	});

  var urlPara = location.search.match(new RegExp('[?&]' + 'xml' + '=([^&]+)'));
	var xml = urlPara ? decodeURIComponent(urlPara[1].replace(/\+/g, '%20')) : '';
	console.log('xml urlPara: ' + xml);
	if (xml && !Ardublockly.LANGUAGE_CHANGED) {
    //console.log("language changed: " + Ardublockly.LANGUAGE_CHANGED);
		//Ardublockly.loadServerXmlFile(xml);
    Ardublockly.loadXmlBlockFile(xml,
      function(success) {
        //console.log('success loading xml from web: ' + success);
        Ardublockly.DEFAULT_PROJECT = xml;
        Ardublockly.sketchNameSet(xml.match(/.*\/(.*).xml/m)[1].replace('%20', ' '));
      },
      function() {
        console.log('error loading xml from web!');
      });
    console.log(xml);
	}

	//check if at least one Kniwwelino is managed
	if (document.getElementById('button_ide_large').className.includes('disabled')) {
  	swal({
			title: Ardublockly.getLocalStr('KNIWWELINO_ADDKNIWWELINO_TITLE'),
			text: Ardublockly.getLocalStr('KNIWWELINO_ADDKNIWWELINO_MESSAGE'),
			className: "kniwwelino-bg",
		  buttons: {
				addK: {
					text: "",
		      value: "addK",
		    },
				ok: true,
		  },
		}).then((k) => {
			if (k == 'addK') {
				document.getElementById('button_manageKniwwelino').click();
			};
		});
	}

  //check if managed Kniwwelinos are online
  setInterval(() => {
    if (document.getElementById('manageKniwwelino').style.display !== "none") {
      if (document.getElementById('button_updateOnlineStatus')) {
        document.getElementById('button_updateOnlineStatus').click();
      }
    }
  }, 2500);
};

/** Binds functions to each of the buttons, nav links, and related. */
Ardublockly.bindActionFunctions = function() {
  // Navigation buttons
  // Ardublockly.bindClick_('button_load', Ardublockly.loadUserXmlFile);
  // Ardublockly.bindClick_('button_save', Ardublockly.saveXmlFile);
  Ardublockly.bindClick_('button_delete', Ardublockly.discardAllBlocks);

  // Floating buttons
  Ardublockly.bindClick_('button_ide_large', function() {
		if (document.getElementById('button_ide_large').className.includes('disabled')) {

		} else {
			console.log('Button Event: Upload Arduino code to server');
	    Ardublockly.ideSendUpload();
		}
  });
  Ardublockly.bindClick_('button_load_xml', Ardublockly.XmlTextareaToBlocks);
	Ardublockly.bindClick_('download_arduino', Ardublockly.saveSketchFile);

  //Ardublockly.bindClick_('button_toggle_toolbox', Ardublockly.toogleToolbox);
  Ardublockly.bindClick_('button_toggle_toolbox', Ardublockly.toogleToolboxSimple);

  Ardublockly.bindClick_('expandCodeButtons', Ardublockly.toggleSourceCodeVisibility);
	Ardublockly.bindClick_('button_manageKniwwelino', Ardublockly.renderKniwwelinosModal);
  Ardublockly.bindClick_('menu_button_restoreKniwwelinoDevices', Ardublockly.loadKniwwelinoDevicesFile);
  Ardublockly.bindClick_('menu_button_backupKniwwelinoDevices', Ardublockly.saveKniwwelinoDevicesFile);


  Ardublockly.bindClick_('button_closeManageKniwwelino', Ardublockly.cleanKniwwelinosModal);

  Ardublockly.bindClick_('button_closeManageKniwwelino', Ardublockly.cleanKniwwelinosModal);

	Ardublockly.bindClick_('menu_button_manageKniwwelino', Ardublockly.renderKniwwelinosModal);
	Ardublockly.bindClick_('menu_load', Ardublockly.loadUserXmlFile);
  Ardublockly.bindClick_('menu_save', Ardublockly.saveXmlFile);
  Ardublockly.bindClick_('menu_delete', Ardublockly.discardAllBlocks);

	Ardublockly.bindClick_('copyright', Ardublockly.renderCopyright);

	Ardublockly.bindKniwwelinoList();
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
	Ardublockly.compileButtonEnable(false);
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

Ardublockly.bindKniwwelinoList
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
 * Loads an XML file from the users file system and adds the blocks into the
 * Blockly workspace.
 */
Ardublockly.loadKniwwelinoDevicesFile = function() {
  // Create File Reader event listener function
  var parseInputJSONfile = function(e) {
    var jsonFile = e.target.files[0];
    var filename = jsonFile.name;
    var extensionPosition = filename.lastIndexOf('.');
    if (extensionPosition !== -1) {
      filename = filename.substr(0, extensionPosition);
    }

Ardublockly.bindKniwwelinoList
    var reader = new FileReader();
    reader.onload = function() {
      var success = Ardublockly.importDeviceList(reader.result);
      if (success) {
        Ardublockly.renderKniwwelinosModal();
        Ardublockly.initKniwwelinoList();
        Ardublockly.getSelectedKniwwelino();
      } else {
        Ardublockly.alertMessage(
            Ardublockly.getLocalStr('invalidDeviceListTitle'),
            Ardublockly.getLocalStr('invalidDeviceListBody'),
            false);
      }
    };
    reader.readAsText(jsonFile);
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
    selectFile.addEventListener('change', parseInputJSONfile, false);
  }
  selectFile.click();
};

/**
 * Creates an JSON file containing the kniwwelino devices and
 * prompts the users to save it into their local file system.
 */
Ardublockly.saveKniwwelinoDevicesFile = function() {
  Ardublockly.saveTextFileAs(
      'KniwwelinoDevicesBackup.json',
      localStorage.getItem("kniwwelinos"));
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

Ardublockly.bindKniwwelinoList = function() {
	var kniwwelinoList = document.getElementById('select_kniwwelino');
	kniwwelinoList.addEventListener(
		'click',  function(e) {
			var source = e.target || e.srcElement;
			Ardublockly.setSelectedKniwwelino(source.value);
		});
};

/**
Import the list of Kniwwelinos from a JSON file merge it into the actual list
*/
Ardublockly.importDeviceList = function(data) {
  let isValid = false;
  try {
    var kniwwelinoJSON = JSON.parse(data);

    //console.log(kniwwelinoJSON);
    if (Array.isArray(kniwwelinoJSON)) {
      for (let jsonObj of kniwwelinoJSON) {
        if (!("type" in jsonObj)==0 || !("id" in jsonObj)==0 || !("mac" in jsonObj)==0 || !("name" in jsonObj)==0) {
          isValid = true;
        } else {
          isValid = false;
          return isValid;
        }
      }

      if (isValid) {
        let oldDeviceLocalStore = localStorage.getItem("kniwwelinos");
        if (oldDeviceLocalStore) {
          let oldDeviceList = JSON.parse(oldDeviceLocalStore);

          mergeByProperty(oldDeviceList, kniwwelinoJSON, 'id');
          //console.log("mergedJSON: " + oldDeviceList);
          localStorage.setItem('kniwwelinos', JSON.stringify(oldDeviceList));
        } else {
          localStorage.setItem('kniwwelinos', JSON.stringify(kniwwelinoJSON));
        }
      }
    }
  } catch(err) {
    console.log("file not a valid json file. " + data);
  }
  return isValid;
};

function mergeByProperty(arr1, arr2, prop) {
  _.each(arr2, function(arr2obj) {
    var arr1obj = _.find(arr1, function(arr1obj) {
      return arr1obj[prop] === arr2obj[prop];
    });

    //If the object already exist extend it with the new values from arr2, otherwise just add the new object to arr1
    arr1obj ? _.extend(arr1obj, arr2obj) : arr1.push(arr2obj);
  });
}

Ardublockly.initKniwwelinoList = function() {
	var kniwwelinoLocalStorage = localStorage.getItem("kniwwelinos");
	var kniwwelinoJSON = JSON.parse(kniwwelinoLocalStorage);
	var kniwwelinos = '<li><select name="select_kniwwelino" id="select_kniwwelino" class="manageKniwwelino browser-default input-field">';

	if (!kniwwelinoLocalStorage || kniwwelinoJSON.length == 0) {
		kniwwelinos += '<option value="default"><span class="translatable_manageKniwwelinoAdd">'+Ardublockly.getLocalStr('manageKniwwelinoAdd')+'</span></option>';
	} else {
		for (var i = 0; i < kniwwelinoJSON.length; i++) {
			kniwwelinos += `<option value="${kniwwelinoJSON[i].mac}" ${kniwwelinoJSON[i].selected}><span class="title">${kniwwelinoJSON[i].name}</span></option>`;
		}
		Ardublockly.compileButtonEnable(true);
	}
	kniwwelinos += '</select></li>';
	document.getElementById('select_kniwwelino').innerHTML = kniwwelinos;
};

Ardublockly.setSelectedKniwwelino = function(mac) {
	var kniwwelinoLocalStorage = localStorage.getItem("kniwwelinos");
	var kniwwelinoJSON = JSON.parse(kniwwelinoLocalStorage);

	for (var i = 0; i < kniwwelinoJSON.length; i++) {
		if (kniwwelinoJSON[i].mac != mac) {
			kniwwelinoJSON[i].selected = "";
		} else {
			kniwwelinoJSON[i].selected = "selected";
		}
	}
	localStorage.setItem('kniwwelinos', JSON.stringify(kniwwelinoJSON));
	Ardublockly.initKniwwelinoList();
};

Ardublockly.getSelectedKniwwelino = function() {
	var kniwwelinoLocalStorage = localStorage.getItem("kniwwelinos");
	var kniwwelinoJSON = JSON.parse(kniwwelinoLocalStorage);
	for (var i = 0; i < kniwwelinoJSON.length; i++) {
		if (kniwwelinoJSON[i].selected == "selected") {
			return kniwwelinoJSON[i].mac;
		}
	}
};

Ardublockly.cleanKniwwelinosModal = function() {
  console.log("cleanKniwwelinosModal");
  // timers.forEach(function (timerID) {
  //   clearTimeout(timerID);
  // });
};

Ardublockly.renderKniwwelinosModal = function() {
  var kniwwelinoLocalStorage = localStorage.getItem("kniwwelinos");

	var kniwwelinoJSON = JSON.parse(kniwwelinoLocalStorage);
	var kniwwelinos = document.getElementById('listKniwwelinosModal').value;

	if (!kniwwelinoLocalStorage) {
		kniwwelinos = '';
		kniwwelinos += Ardublockly.getLocalStr('manageKniwwelinoZero');
    kniwwelinos += '<a href="#!" class="btn-flat listReload"><i id="button_updateOnlineStatus" class="mdi-av-loop"></i></a>';
	} else {

		kniwwelinos = '';
		kniwwelinos += Ardublockly.getLocalStr('manageKniwwelinoManaging')+` ${kniwwelinoJSON.length} Kniwwelinos`;
    kniwwelinos += '<a href="#!" class="btn-flat listReload"><i id="button_updateOnlineStatus" class="mdi-av-loop"></i></a>';

		kniwwelinos += '<ul class="collection">';

		for (var i = 0; i < kniwwelinoJSON.length; i++) {
			kniwwelinos += '<li class="collection-item avatar">';
      kniwwelinos += `<span class="onlineBadge offline" id="${kniwwelinoJSON[i].id}"></span>`;
			kniwwelinos += '<img src="img/mascot.png" alt="" class="circle">';
			kniwwelinos += `<span class="title">${kniwwelinoJSON[i].name}</span><br>`;
			kniwwelinos += `<span class="id">ID: ${kniwwelinoJSON[i].id}</span><br>`;
			kniwwelinos += `<span class="mac">MAC: ${kniwwelinoJSON[i].mac}</span>`;
			kniwwelinos += `<a href="#!" class="btn-floating btn secondary-content" onclick="_paq.push(['trackEvent', 'ManageKniwwelino', 'delete']);"><i id="delete_addKniwwelino_${kniwwelinoJSON[i].id}" class="mdi-content-remove-circle-outline red"></i></a>`;
			kniwwelinos += '</li>';
		}
		kniwwelinos += '</ul>';
	}

	kniwwelinos += '<div id="addKniwwelino">';
	kniwwelinos += `<div class="col s12">`;
	kniwwelinos += '<label for="name">'+Ardublockly.getLocalStr('manageKniwwelinoName')+'</label>';
	kniwwelinos += '<input placeholder="'+Ardublockly.getLocalStr('manageKniwwelinoPlaceholder')+'" id="name_addKniwwelino" type="text" class="validate">';
	kniwwelinos += '</div>';
	kniwwelinos += `<a href="#!" id="button_addKniwwelino" class="btn-floating disabled secondary-content green" onclick="_paq.push(['trackEvent', 'ManageKniwwelino', 'add']);"><i class="mdi-content-add-circle-outline"></i></a>`;
	kniwwelinos += '<div class="ledmatrix-description">';
	kniwwelinos += Ardublockly.getLocalStr('manageKniwwelinoHelp');
	kniwwelinos += '</div>';
	kniwwelinos += '<div class="ideditor">';
	kniwwelinos += '<div class="led2id">';
	kniwwelinos += '	<table style="display: inline-block" class="ledmatrix">';
	kniwwelinos += '				<tr>';
	kniwwelinos += '						<td></td>';
	kniwwelinos += '					<td id="ledcols"></td>';
	kniwwelinos += '			</tr>';
	kniwwelinos += '			<tr>';
	kniwwelinos += '					<td id="ledrows"></td>';
	kniwwelinos += '					<td id="leds"></td>';
	kniwwelinos += '			</tr>';
	kniwwelinos += '		</table>';
	kniwwelinos += '	</div>';
	kniwwelinos += '</div>';

	kniwwelinos += '</div>';

	document.getElementById('listKniwwelinosModal').innerHTML = kniwwelinos;

	if (kniwwelinoLocalStorage) {
		for (var i = 0; i < kniwwelinoJSON.length; i++) {
			document.getElementById(`delete_addKniwwelino_${kniwwelinoJSON[i].id}`).addEventListener(
				'click',  function(e) {
					var selectFirst = false;
					var source = e.target || e.srcElement;
					var deleteThis = source.id.substr(-6);
					var kniwwelinoJSON = JSON.parse(localStorage.getItem("kniwwelinos"));
					var tempJSON = JSON.parse('[]');
					for (var i = 0; i < kniwwelinoJSON.length; i++) {
						if(kniwwelinoJSON[i].id != deleteThis) {
							tempJSON.push(kniwwelinoJSON[i]);
						}
						if(kniwwelinoJSON[i].id == deleteThis && kniwwelinoJSON[i].selected == "selected" ) {
							selectFirst = true;
						}
					}

					if (selectFirst && kniwwelinoJSON.length > 1) {
						tempJSON[0].selected = "selected";
					}
					localStorage.setItem('kniwwelinos', JSON.stringify(tempJSON));
					Ardublockly.renderKniwwelinosModal();
					Ardublockly.initKniwwelinoList();
				});

      Ardublockly.updateOnlineStatus(kniwwelinoJSON[i].id);
    }
	}

	document.getElementById('name_addKniwwelino').addEventListener(
		'keyup', function() {
	    let val = document.getElementById('name_addKniwwelino').value;
	    if (val.length > 3) {
				document.getElementById('button_addKniwwelino').className = 'btn-floating secondary-content green';
			} else {
				document.getElementById('button_addKniwwelino').className = 'btn-floating disabled secondary-content green';
			}
	});

  document.getElementById('button_updateOnlineStatus').addEventListener(
		'click',  function() {
      if (kniwwelinoLocalStorage) {
    		for (var i = 0; i < kniwwelinoJSON.length; i++) {
          Ardublockly.updateOnlineStatus(kniwwelinoJSON[i].id);
        }
      }
    }
  );

	document.getElementById('button_addKniwwelino').addEventListener(
		'click',  function() {
			 if (!document.getElementById('button_addKniwwelino').className.includes('disabled')) {
				 ArdublocklyServer.getJson("/id?id="+Ardublockly.getLedMatrixID(), function (res) {
	 				if (Object.keys(res).length === 0) {
						swal({
							title: Ardublockly.getLocalStr('KNIWWELINO_WARNING_TITLE'),
							text: Ardublockly.getLocalStr('manageKniwwelinoNoID'),
							className: "kniwwelino-bg"
						});
	 					return;
	 				} else if (Object.keys(res).length > 1) { //TODO How to handle this case
						swal({
							title: Ardublockly.getLocalStr('KNIWWELINO_WARNING_TITLE'),
							text: Ardublockly.getLocalStr('manageKniwwelinoNoUniqueID'),
							className: "kniwwelino-bg"
						});
	 					return;
	 				}
	 				let newKniwwelino = {};
	 				newKniwwelino.type = "kniwwelino";
	 				newKniwwelino.id = Ardublockly.getLedMatrixID();
	 				newKniwwelino.mac = Object.keys(res[Object.keys(res)])[0];
	 				newKniwwelino.name = document.getElementById('name_addKniwwelino').value;
	 				newKniwwelino.selected = "selected";
	 				if (newKniwwelino.name == "") {
						swal({
							title: Ardublockly.getLocalStr('manageKniwwelinoNameRequired'),
							text: Ardublockly.getLocalStr('manageKniwwelinoNameRequired_message'),
							className: "kniwwelino-bg"
						});
	 					return;
	 				}

	 				var kniwwelinoJSON = JSON.parse(localStorage.getItem("kniwwelinos"));
	 				if (kniwwelinoJSON !== null) {
	 					//check if Kniwwelino already exists in localStorage
	 					for (var i = 0; i < kniwwelinoJSON.length; i++) {
	 						if(kniwwelinoJSON[i].mac == newKniwwelino.mac) {
								swal({
									title: Ardublockly.getLocalStr('KNIWWELINO_WARNING_TITLE'),
									text: Ardublockly.getLocalStr('manageKniwwelinoAlreadyManaging'),
									className: "kniwwelino-bg"
								});
	 							return;
	 						}
	 						if(kniwwelinoJSON[i].selected == "selected") {
	 							kniwwelinoJSON[i].selected = "";
	 						}
	 					}
	 					kniwwelinoJSON.push(newKniwwelino);
	 				} else {
	 					var kniwwelinoJSON = [newKniwwelino];
	 				}

	 				localStorage.setItem('kniwwelinos', JSON.stringify(kniwwelinoJSON));
	 				Ardublockly.renderKniwwelinosModal();
	 				Ardublockly.initKniwwelinoList();
	 			});
			 }
		});
	Ardublockly.LedMatrix();
};

Ardublockly.updateOnlineStatus = function(id) {
  ArdublocklyServer.getJson("/id?id="+id, function (res) {
    for(var x in res){
      var id = x;
      var val = res[x];
      //console.log(id + " : " + val);
      for(var y in val){
        var mac = y;
        let val2 = val[mac];
        //console.log(mac + " : " + val2);
        console.log(mac + " online: " + val2.online);
        if (val2.online) {
          document.getElementById(id).classList.remove('offline');
          document.getElementById(id).classList.add('online');
        } else {
          document.getElementById(id).classList.remove('online');
          document.getElementById(id).classList.add('offline');
        }
      }
    }
    //console.log(res);
  });
}

Ardublockly.renderCopyright  = function() {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {
	       document.getElementById('gen_copyright_body').innerHTML = xhttp.responseText;
	    }
	};
	xhttp.open("GET", "/termsofuse", true);
	xhttp.send();
}

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
		if (jsonObj.code > 0) {
			Ardublockly.shortMessage(Ardublockly.getLocalStr('compiledSketchFailed'));
			Ardublockly.highlightIdeOutputHeader();
			if (!document.getElementById('ide_output_collapsible_header').className.match('active')) {
				document.getElementById('ide_output_collapsible_header').click();
			}
		} else {
			Ardublockly.shortMessage(Ardublockly.getLocalStr('compiledSketch'));
		}
  };

  ArdublocklyServer.sendSketchToServer(
      Ardublockly.generateArduino(), document.getElementById('sketch_name').value, Ardublockly.getSelectedKniwwelino(), sendCodeReturn);
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
		document.getElementById('codesidebar').style.width = "35%";
    document.getElementById('codesidebar').style.visibility = "visible";
		document.getElementById('codesidebar').style.display = "";
  } else {
    document.getElementById('blocks_workspace').style.width = "100%";
    document.getElementById('codesidebar').style.visibility = "hidden";
		document.getElementById('codesidebar').style.display = "none";
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
 * Private variable to indicate if the toolbox is in simple mode or not.
 * @type {!boolean}
 * @private
 */
Ardublockly.TOOLBAR_SHOWING_SIMPLE_ = true;

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

Ardublockly.toogleToolboxSimple = function() {
  var buttonIcon = document.getElementById('button_toggle_toolbox_icon');
  var buttonText = document.getElementById('toggle_toolbox_text');
  var visOn = 'fa fa-angle-down';
  var visOff = 'fa fa-angle-double-right';
  var textSimple = 'simple';
  var textAdvanced = 'advanced';

  if (Ardublockly.TOOLBAR_SHOWING_SIMPLE_) {
    buttonIcon.className = buttonIcon.className.replace(visOn, visOff);
    buttonText.className = buttonText.className.replace('translatable_'+textSimple, 'translatable_'+textAdvanced);
    buttonText.innerHTML = Ardublockly.getLocalStr(textSimple);

    var categories = Blockly.Xml.textToDom(Ardublockly.TOOLBOX_XML);
    for (var i = 0; i < categories.childNodes.length; i++) {
      var category = categories.childNodes[i];
      if (category.nodeType == 1 && category.hasAttribute("adv")) {
        //console.log(category.getAttribute("id"));
        if (category.getAttribute("adv")) {
          //console.log(categories.childNodes[i].parentNode);
          try {
            categories.removeChild(category);
          } catch(err) {
            console.log("category already removed");
          }
        }
      } else {
        for (var j = 0; j < category.childNodes.length; j++) {
          var block = category.childNodes[j];
          if(block.nodeType == 1 && block.hasAttribute("adv")) {
            if (block.getAttribute("adv")) {
              categories.childNodes[i].removeChild(block);
            }
          }
        }
      }
    }
    Ardublockly.xmlTree = categories;
  } else {
    buttonIcon.className = buttonIcon.className.replace(visOff, visOn);
    buttonText.className = buttonText.className.replace('translatable_'+textAdvanced, 'translatable_'+textSimple);
    buttonText.innerHTML = Ardublockly.getLocalStr(textAdvanced);
    Ardublockly.xmlTree = Blockly.Xml.textToDom(Ardublockly.TOOLBOX_XML);
  }
  Ardublockly.updateToolboxLanguage();
  Ardublockly.workspace.updateToolbox(Ardublockly.xmlTree);
  Ardublockly.TOOLBAR_SHOWING_SIMPLE_ = !Ardublockly.TOOLBAR_SHOWING_SIMPLE_;
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

Ardublockly.getSketchName = function(digits) {
	if (digits != null) {
		return document.getElementById('sketch_name').value.substr(0, digits);
	}
	return document.getElementById('sketch_name').value;
};
