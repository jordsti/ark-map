var divLog;
var ratio;
var zoom;
var imgHeight;
var imgWidth;
var tooltipLength = 2000;
var tooltipShow = false;

var pins = new Array();

function showMapTooltip(message)
{
	$('#map-tooltip').show();
	$('#map-tooltip').css('visibility', 'visible');
	$('#map-tooltip').html(message);
}

function hideMapTooltip()
{
	$('#map-tooltip').hide();
	$('#map-tooltip').css('visibility', 'hidden');
}

function initMap()
{	
	showMapTooltip('Loading maps and pins...');
	$('#ark-map').append('<img id="map-image" onclick="addPinForm(event);" src="full_map.jpg" /><div id="log"></div>');
	var img_map = $('#map-image');
	
	imgHeight = img_map.height();
	imgWidth = img_map.width();
	
	var height = $(window).height();
	ratio = (imgHeight/imgWidth);
	zoom = height/imgHeight;
	var width = zoom * imgWidth;
	height = zoom * imgHeight;
	
	img_map.css('width', width);
	img_map.css('height', height);
	
	var img_map_v = document.getElementById('map-image');
	
	img_map_v.addEventListener("mousewheel", mapWheelHandler, false);
	img_map_v.addEventListener("DOMMouseScroll", mapWheelHandler, false);
	
	loadPins();
}

function closePinForm()
{
	$('#add-pin-form').css('visibility', 'hidden');
}

function loadPins()
{
	var req = $.ajax({
		url: 'pins.php?action=get_pins',
		dataType: 'json'
		}).done(function(data){
			for(var i=0; i<data.length; i++)
			{
				var pin = {
					id: data[i].id,
					x: data[i].x,
					y: data[i].y,
					pinnedBy: data[i].pinnedBy,
					note: data[i].note
					}
				
				pins.push(pin);
			}
			
			drawPins();
			hideMapTooltip();
			});
			
}

function addPin()
{
	var pin_x = $('#pin-x').val();
	var pin_y = $('#pin-y').val();
	var pin_note = $('#pin-note').val();
	
	var form_data = {
		'pin-x': pin_x,
		'pin-y': pin_y,
		'pin-note': pin_note
	}
	
	var url = 'pins.php?action=add_pin';
	showMapTooltip('Saving pin...');
	$.post(url, form_data).done(
		function(data) {
			var pinObj = JSON.parse(data);
			pins.push(pinObj);
			drawPins();
			hideMapTooltip();
		}
	);
	
	closePinForm();
}

function addPinForm(e)
{
	$('#add-pin-form').show();
	$('#add-pin-form').css('visibility', 'visible');
	$('#add-pin-form').css('left', $(window).scrollLeft());
	$('#add-pin-form').css('top', $(window).scrollTop());
	$('#pin-note').val("");
	
	var pin_x = (e.clientX + $(window).scrollLeft()) / zoom;
	var pin_y = (e.clientY + $(window).scrollTop()) / zoom;
	
	$("#pin-x").val(pin_x);
	$("#pin-y").val(pin_y);
	
}

function drawPins()
{
	var divMap = $('#ark-map');
	
	for(var i=0; i<pins.length; i++)
	{
		var pin = pins[i];
		
		var divPin = document.getElementById('pin_'+pin.id);
		
		if(!divPin)
		{
			divMap.append('<div id="pin_'+pin.id+'" class="normal-pin" onmouseover="showPinInfo('+pin.id+');"></div>');
		}
		
		$('#pin_'+pin.id).css('top', (pin.y * zoom));
		$('#pin_'+pin.id).css('left', (pin.x * zoom));
	}
}

function getPinById(pinId)
{
	for(var i=0; i<pins.length; i++)
	{
		var pin = pins[i];
		if(pin.id == pinId)
		{
			return pin;
		}
	}
	
	return null;
}

function showPinInfo(pinId)
{
	var pin = getPinById(pinId);
	if(pin)
	{
		var pin_x = pin.x * zoom;
		var pin_y = pin.y * zoom;
		
		$('#pin-tooltip').show();
		$('#pin-tooltip').css('visibility', 'visible');
		$('#pin-tooltip').css('left', pin_x);
		$('#pin-tooltip').css('top', pin_y);
		$('#pin-tooltip').html('Pinned By : '+pin.pinnedBy+'<br />'+'Note : '+pin.note);
		
		tooltipShow = true;
		
		setTimeout(removeTooltip, tooltipLength);
	}
}

function removeTooltip()
{
	tooltipShow = false;
	$('#pin-tooltip').css('visibility', 'hidden');
}

function mapWheelHandler(e)
{
	e.preventDefault();
	e.stopPropagation();
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	
	if(delta > 0)
	{
		if(zoom < 1)
		{
			zoom = zoom + 0.1
			
			if(zoom > 1)
			{
				zoom = 1;
			}
		}
	}
	else if(delta < 0)
	{
		if(zoom > 0.2)
		{
			zoom = zoom - 0.1;
			
			if(zoom < 0.1)
			{
				zoom = 0.1;
			}
		}
	}
	
	var nWidth = imgWidth * zoom;
	var nHeight = imgHeight * zoom;
	
	var img_map = $('#map-image');
	img_map.css('width', nWidth);
	img_map.css('height', nHeight);
	drawPins();
}
