var btnSearch = $("#search");
var txtCity = $("#city")
var lblCity = $("#cityLabel");
var geoAPI = "http://api.openweathermap.org/geo/1.0/direct?q";
var weatherAPI = "http://api.openweathermap.org/data/2.5/forecast?";
var apiKey ="3e78d3d25859edb4cb2f6dbc092cfcf3";

function getCityTemp(){

    event.preventDefault()
    if (txtCity.val()) {
      lblCity.text(txtCity.val());
      getLatLong(txtCity.val());
      
    }
    else {
        lblCity.text("Invalid City. Please try again");
    }   

}

function getLatLong(city) {
  var apiURL = geoAPI + "=" + city + "&limit=5&appid=" + apiKey;
  fetch(apiURL).then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        console.log(data);
      })
    }
  })

  var returnObj = {};

}