(function() {
	"use strict";
var ikData = [
	{
		"type": "УИКи",
		"pict": "images/number_{number}.png",
		"shadow": "images/shadow.png",
		"popupTpl": "<strong>УИК {number}  ({count})</strong><br/>{obj}. {addr}, тел. {phone}"
	},
	{
		"type": "ТИКи",
		"pict": "images/symbol_sum.png",
		"shadow": "images/shadow.png",
		"popupTpl": "<strong>ТИК <a href='{url}'>{name}</a></strong><br/>{desc}"
	}
];

var getMapYaCentered = function() {
var map = new L.Map('map');
	var cloudmade = new L.TileLayer('http://{s}.tile.cloudmade.com/4dbea02acb2d47779913c727fa16dda9/997/256/{z}/{x}/{y}.png',
		{
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
			maxZoom: 18
		}
	);
	var center = new L.LatLng(52.7842846, 37.6806436);
	map.setView(center, 11).addLayer(cloudmade);
	return map;
};
var tpl = function(templ, obj) {
	return templ.replace(/{([^}]+)}/g, function(a, b) {
		return obj[b];
	});
};
var createMap = function() {
	var map = getMapYaCentered(),
		IkIcon = L.Icon.extend({
			iconSize: new L.Point(32, 37),
			shadowSize: new L.Point(51, 37),
			shadowUrl: "images/shadow.png"
		}),
		groupIcon,
		markerPlace,
		marker,
		arr;

	for (var i = 0, len = ikData.length; i < len; i++) {
		arr = ikData[i].data;
		for (var j = 0, leng = arr.length; j < leng; j++) {
			groupIcon = new IkIcon(tpl(ikData[i].pict, arr[j]));
			markerPlace = new L.LatLng(arr[j].lat, arr[j].lon);
			marker = new L.Marker(markerPlace, {icon: groupIcon});
			marker.bindPopup(tpl(ikData[i].popupTpl, arr[j]));
			map.addLayer(marker);
		}
	}


	/*var successGetLoc = function(position) {
		map.setView(new L.LatLng(position.coords.latitude, position.coords.longitude), 15);
	};
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(successGetLoc);
	}*/
};
function getHTTPObject() {
	if (typeof XMLHttpRequest != "undefined") {
		return new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0"];
		for (var i = 0; i < versions.length; i++) {
			try {
				var oXmlHttp = new ActiveXObject(versions[i]);
				return oXmlHttp;
			} catch (err) {}
		}
	}
}
var xhr = getHTTPObject();
xhr.open("GET", "iks.json", true);
xhr.onreadystatechange = function() {
	if (xhr.readyState == 4) {
		if (xhr.status == 200 || xhr.status == 304) {
			var iks = JSON.parse(xhr.responseText);
			ikData[0].data = iks.uiks;
			ikData[1].data = iks.tiks;
			createMap();
		}
	}
};
xhr.send(null);
})();
