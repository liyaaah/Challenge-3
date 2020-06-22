// Set api token
mapboxgl.accessToken = 'pk.eyJ1IjoibmF0YWxpeWFhYWgiLCJhIjoiY2tiN3RjeTlqMDh5eDMwcGcwMnA3dWE4NiJ9.fcYclUY5T5MDc3R-iYErrA';

// Initialate map
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center:[4.3240,52.0671],
  zoom:15,

});

//[placesList[i].geometry.coordinates[0]


  // style: 'mapbox://styles/mapbox/satellite-v9'
  // style: 'mapbox://styles/mapbox/dark-v10'
  // pitch: 45,
  // bearing: -17.6,
  // Positioning the map on a certain longitute + latitude and zooming in
  // Let op de volgorde van de lat, lon!!
  // center: [4.322840, 52.067101],
  // zoom: 15,


// Add zoom and rotation controls to the map.
// map.addControl(new mapboxgl.NavigationControl()); \


// make your custom style https://studio.mapbox.com/


document.getElementById('submit').addEventListener("click",function(){
   var cityname= document.getElementById("city").value;
   getAPIdata(cityname);
   getLocation(cityname);
});


function getAPIdata(city) {

  var url = 'https://api.openweathermap.org/data/2.5/weather';
  var apiKey ='22d47d57cfa66eb8939543266baa1960';
  var city = city;

  // construct request
  var request = url + '?' + 'appid=' + apiKey + '&' + 'q=' + city;
  
  
  // get current weather
  fetch(request)
  
  // parse to JSON format
  .then(function(response) {
    if(!response.ok) throw Error(response.statusText);
    return response.json();
  })
  
  // render weather per day
  .then(function(response) {
    // render weatherCondition
    onAPISucces(response);  
  })
  
  // catch error
  .catch(function (error) {
    onAPIError(error);
  });
}

function onAPISucces(response) {
  
  console.log(response);
  // get temperature in Celcius
  var degC = Math.floor(response.main.temp - 273.15);

  // weather desciption
  var desc = response.weather[0].description;

  // icon weather
  //var iconCode = response.weather[0].icon;
  //var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";

  var weatherBox = document.getElementById('weather');
  weatherBox.innerHTML =  '<h1>'+ degC +'&#176;C' +'</h1>'+'<br><br><br>'+ desc;

}


function onAPIError(error) {
  console.error('Request failed', error);
  var weatherBox = document.getElementById('weather');
  weatherBox.className = 'hidden'; 
}

function locationOnMap(latitude,longitude,attractions){
    // Set api token
    mapboxgl.accessToken = 'pk.eyJ1IjoibmF0YWxpeWFhYWgiLCJhIjoiY2tiN3RjeTlqMDh5eDMwcGcwMnA3dWE4NiJ9.fcYclUY5T5MDc3R-iYErrA';

    // Initialate map
    var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [longitude,latitude],
    zoom: 12,

});
    console.log(attractions);
    var attractions = attractions;
    var i;
    for(i = 0; i<attractions.length;i++){
      var myCustomMarker = document.createElement('div');
      myCustomMarker.className = 'customMarker';
      var myPopup = new mapboxgl.Popup().setHTML('<h3>'+ attractions[i].properties.name +'</h3');
      var marker = new mapboxgl.Marker(myCustomMarker).setLngLat([attractions[i].geometry.coordinates[0],attractions[i].geometry.coordinates[1]]).setPopup(myPopup).addTo(map);
    }
}



function findAttractionsLocation(longitude_min,latitude_min,longitude_max, latitude_max, center_lat, center_lon){
  var lat_min=latitude_min;
  var lat_max=latitude_max;
  var lon_min =longitude_min;
  var lon_max = longitude_max;
  var center_lon=center_lon;
  var center_lat= center_lat;

  var url = "http://api.opentripmap.com/0.1/en/places/bbox?";
  var setRange = "lon_min=" + lon_min +"&lat_min=" + lat_min+ "&lon_max="+lon_max+"&lat_max=" + lat_max;
  var setCategory="&kinds=pubs&format=geojson&apikey=";
  var key="5ae2e3f221c38a28845f05b621fb3490869f55c4c5350a4447d5b884";

  //construct request

  var request = url+setRange+setCategory+key;

  //get list of attractions 
  fetch(request)

  // parse to JSON format
  .then(function(response) {
    if(!response.ok) throw Error(response.statusText);
    return response.json();
  })
  
  // render location
  .then(function(response) {
    // render weatherCondition
    attractionsOnSucces(response, center_lat, center_lon);  
  })
  
  // catch error
  .catch(function (error) {
    onAPILocationError(error);
  });

}

function attractionsOnSucces(response, latitude, longitude){
  var lat=latitude;
  var lon=longitude;
  var placesList = response.features;

  locationOnMap(lat, lon, placesList);

  var amountPubs = placesList.length;

  var pubInfo = document.getElementById('pubinfo');
  pubInfo.innerHTML = '<h1>'+ amountPubs+ '<br>'+'pubs' + '</h1>' + "to dicover in this city"; 

}

function getLocation(city){
  var url = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
  var city = city;
  var apiKey = 'pk.eyJ1IjoibmF0YWxpeWFhYWgiLCJhIjoiY2tiN3RjeTlqMDh5eDMwcGcwMnA3dWE4NiJ9.fcYclUY5T5MDc3R-iYErrA';


  //construct request

  var request = url + city+ '.json?access_token=' + apiKey;

  //get longitude and latitude 
  fetch(request)

  // parse to JSON format
  .then(function(response) {
    if(!response.ok) throw Error(response.statusText);
    return response.json();
  })
  
  // render location
  .then(function(response) {
    // render weatherCondition
    onAPILocationSucces(response);  
  })
  
  // catch error
  .catch(function (error) {
    onAPILocationError(error);
  });


}

function onAPILocationSucces(response) {
  console.log(response);
  var longitude_min = response.features[0].bbox[0];
  var latitude_min = response.features[0].bbox[1];
  var longitude_max =response.features[0].bbox[2];
  var latitude_max = response.features[0].bbox[3];
  var center_lon=response.features[0].center[0];
  var center_lat=response.features[0].center[1];

  findAttractionsLocation(longitude_min,latitude_min,longitude_max, latitude_max, center_lat, center_lon);

}

function onAPILocationError(error) {
  console.error('Request location failed', error);
}