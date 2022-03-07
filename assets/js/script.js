var btnSearch = $("#search");
var txtCity = $("#city")
var lblCity = $("#cityLabel");
var geoAPI = "http://api.openweathermap.org/geo/1.0/direct";
var weatherAPI = "http://api.openweathermap.org/data/2.5/forecast";
var currConditionAPI = "http://api.openweathermap.org/data/2.5/weather"
var apiKey ="e3de7b451ff3cdc179f2915141cb031b";
var lat;
var lon;
var tempSpan = $("#currTemp")

function getCityTemp(){
    event.preventDefault()
    if (txtCity.val()) {
      var city = txtCity.val().trim()
      getLatLong(city);
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
        if (Object.keys(data).length === 0) {
          lblCity.text("Invalid City. Please try again");
        }
        else {
          lblCity.text(data[0].name + ", " + data[0].state + ", " + data[0].country);
          lat = data[0].lat;
          lon = data[0].lon; 
          getCurrConditions(city);
        }
      })
    }
    //else alert("Unable to connect to Open Weather. Please try again later.");
  })
  // .catch(function(error) {
  //   // Notice this `.catch()` getting chained onto the end of the `.then()` method
  //   alert("Unable to connect to Open Weather. Please try again later.");
  // })
}

function getCurrConditions(city) {
  var ccURL = currConditionAPI + "?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;
  
  fetch(ccURL).then(function(response) {
    if (response.status === 200) {
      response.json().then(function(data) {
        console.log(KelvinToFahrenheit(data.main.temp));
        tempSpan.text(KelvinToFahrenheit(data.main.temp)+ '\u00B0 F');
      })
    }
    //else alert("Unable to connect to Open Weather. Please try again later.");
  })
  // .catch(function(error) {
  //   // Notice this `.catch()` getting chained onto the end of the `.then()` method
  //   alert("Unable to connect to Open Weather. Please try again later.");
  // })
}

function KelvinToFahrenheit(temp) {
  //℉=((K-273.15)*1.8)+32
  return ((((temp-273.15)*1.8)+32).toFixed(2));
}

function speedToMPH (speed) {

}

