var btnSearch = $("#search");
var txtCity = $("#city")
var lblCity = $("#cityLabel");
var geoAPI = "http://api.openweathermap.org/geo/1.0/direct";
var weatherAPI = "http://api.openweathermap.org/data/2.5/forecast";
var currConditionAPI = "http://api.openweathermap.org/data/2.5/weather"
var apiKey ="3e78d3d25859edb4cb2f6dbc092cfcf3";
var lat;
var lon;

function getCityTemp(){
    event.preventDefault()
    if (txtCity.val()) {
      getLatLong(txtCity.val());
      txtCity.val('')
    }
    else {
        lblCity.text("Invalid City. Please try again");
    }   
}

function getLatLong(city) {
  var apiURL = geoAPI + "?q=" + city + "&limit=1&appid=" + apiKey;
  fetch(apiURL).then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        console.log(data);
        if (Object.keys(data).length === 0) {
          lblCity.text("Invalid City. Please try again");
        }
        else {
          lblCity.text(data[0].name + ", " + data[0].state + ", " + data[0].country);
          lat = data[0].lat;
          lon = data[0].lon;
        }
      })
    }
  })
}
