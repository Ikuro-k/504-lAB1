window.alert("This page will ask you for your location information. Your location information will not be stored. Click OK to continue.");

var light = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id:'mapbox/light-v10',
    accessToken: 'pk.eyJ1IjoiaWt1cm9rYW5nZXRoZSIsImEiOiJjbDl4dml3bTYwM3pxM3Z0Y2JlNjhwbWo3In0.vVVHk3BPPwNVnRxCoU88-g',
    tileSize: 512,
    zoomOffset: -1,
});

var dark = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id:'mapbox/dark-v10',
    accessToken: 'pk.eyJ1IjoiaWt1cm9rYW5nZXRoZSIsImEiOiJjbDl4dml3bTYwM3pxM3Z0Y2JlNjhwbWo3In0.vVVHk3BPPwNVnRxCoU88-g',
    tileSize: 512,
    zoomOffset: -1,
});

var map = L.map('map', {layers:[light]}).fitWorld();

function onLocationFound(e) {
    var radius = e.accuracy;

    L.marker(e.latlng).addTo(map)  
        .bindPopup("You are within " + Math.round(radius * 3.28084) + " feet of this point").openPopup(); 

    if (radius <= 100) {
      L.circle(e.latlng, radius, {color: 'green'}).addTo(map);
    }
    else{
      L.circle(e.latlng, radius, {color: 'red'}).addTo(map);
    }
    var times = SunCalc.getTimes(new Date(), e.latitude, e.longitude);
    var sunrise = times.sunrise.getHours();
    var sunset = times.sunset.getHours();


    var currentTime = new Date().getHours();
        if (sunrise < currentTime && currentTime < sunset){
        map.removeLayer(dark);
        map.addLayer(light);
        }
        else {
        map.removeLayer(light);
        map.addLayer(dark);
        }
}

map.on('locationfound', onLocationFound); 

function onLocationError(e) {
  alert(e.message);
}

map.on('locationerror', onLocationError);

map.locate({setView: true, maxZoom: 16});

var layerControl = L.control.layers(null, null, {collapsed: false});

layerControl.addBaseLayer(light, "Light");
layerControl.addBaseLayer(dark, "Dark");

layerControl.addTo(map);

const geolocateButton = document.getElementById("geolocate-button");

geolocateButton.addEventListener("click", function() {
    map.locate({ setView: true });
  });
  