
var id = "000000";

Ardublockly.setLedMatrixID = function(kid) {
	id = kid;
	var $leds = $('#leds');
	function hexInputToLeds() {
		for (var i = 1; i < 7; i++) {
				var byte = id.substr(i-1, 1);
				console.log(byte);

				byte = parseInt(byte, 16);
				for (var j = 1; j < 5; j++) {
						var active = !!(byte & 1 << (j - 1));
						$leds.find('td[data-row=' + (i) + '][data-col=' + (5-j) + '] ').toggleClass('active', active);
				}
				for (var j = 1; j < 5; j++) {
						var active = !!(byte & 1 << (j - 1));
						$leds.find('td[data-row=' + (5-j) + '][data-col=' + 5 + '] ').toggleClass('active', active);
				}
		}
	}
	hexInputToLeds();
}

Ardublockly.getLedMatrixID = function() {
	console.log(`ID ${id} requested`);
	return id;
}

Ardublockly.LedMatrix = function () {

    var $leds = $('#leds');

    var generator = {
        tableCols: function () {
            // var out = ['<table class="cols"><tr>'];
            // for (var i = 1; i < 6; i++) {
            //     out.push('<td data-col="' + i + '">' + i + '</td>');
            // }
            // out.push('</tr></table>');
            // return out.join('');
        },
        tableRows: function () {
            // var out = ['<table class="rows">'];
            // for (var i = 1; i < 6; i++) {
            //     out.push('<tr><td data-row="' + i + '">' + i + '</td></tr>');
            // }
            // out.push('</table>');
            // return out.join('');
        },
        tableLeds: function () {
            var out = ['<table class="leds">'];
            for (var i = 1; i < 6; i++) {
                out.push('<tr>');
                for (var j = 1; j < 6; j++) {
                    out.push('<td data-row="' + i + '" data-col="' + j + '"></td>');
                }
                out.push('</tr>');
            }
            out.push('</table>');
            return out.join('');
        }
    };

  	function ledsToHex() {
        var out = [];
        for (var i = 1; i < 6; i++) {
          var byte = [];
          for (var j = 1; j < 5; j++) {
            var active = $leds.find('td[data-row=' + i + '][data-col=' + j + '] ').hasClass('active');
            byte.push(active ? '1' : '0');
          }
          byte = parseInt(byte.join(''), 2).toString(16);
          out.push(byte);
        }
				var byte = [];
				for (var j = 1; j < 5; j++) {
          var active = $leds.find('td[data-row=' + j + '][data-col=' + 5 + '] ').hasClass('active');
          byte.push(active ? '1' : '0');
	      }
				byte = parseInt(byte.join(''), 2).toString(16);
				out.push(byte);

				//console.log(out.join('').toUpperCase());
				id = out.join('').toUpperCase();
    }

		function hexInputToLeds() {
      for (var i = 1; i < 7; i++) {
          var byte = id.substr(i-1, 1);
					console.log(byte);

          byte = parseInt(byte, 16);
          for (var j = 1; j < 5; j++) {
              var active = !!(byte & 1 << (j - 1));
              $leds.find('td[data-row=' + (i) + '][data-col=' + (5-j) + '] ').toggleClass('active', active);
          }
					for (var j = 1; j < 5; j++) {
              var active = !!(byte & 1 << (j - 1));
              $leds.find('td[data-row=' + (5-j) + '][data-col=' + 5 + '] ').toggleClass('active', active);
          }
      }
    }

    function processToSave($focusToPreview) {
        $previews.find('.preview.selected').removeClass('selected');

        if ($focusToPreview.length) {
            $focusToPreview.addClass('selected');
            $deleteButton.removeAttr('disabled');
            $updateButton.removeAttr('disabled');
        } else {
            $deleteButton.attr('disabled', 'disabled');
            $updateButton.attr('disabled', 'disabled');
        }
        saveState();
    }

    $('#ledcols').append($(generator.tableCols()));
    $('#ledrows').append($(generator.tableRows()));
    $leds.append($(generator.tableLeds()));

    $leds.find('td').mousedown(function () {
      $(this).toggleClass('active');
      ledsToHex();
    });

    $('table.ledcols td').mousedown(function () {
        var col = $(this).attr('data-col');
        $leds.find('td[data-col=' + col + ']').toggleClass('active',
            $leds.find('td[data-col=' + col + '].active').length != 8);
        ledsToHex();
    });

    $('table.ledrows td[data-row]').mousedown(function () {
        var row = $(this).attr('data-row');
        $leds.find('td[data-row=' + row + ']').toggleClass('active',
            $leds.find('td[data-row=' + row + '].active').length != 8);
        ledsToHex();
    });

    $('#indexSelectsWhole').hover(function () {
        $('table.ledcols td').addClass('hover');
        $('table.ledrows td').addClass('hover');
    }, function () {
        $('table.ledcols td').removeClass('hover');
        $('table.ledrows td').removeClass('hover');
    });


}
