var btnSearch = $("#search");
var txtCity = $("#city")
var lblCity = $("#cityLabel");
var geoAPI = "http://api.openweathermap.org/geo/1.0/direct";
var weatherAPI = "http://api.openweathermap.org/data/2.5/forecast";
var currConditionAPI = "http://api.openweathermap.org/data/2.5/onecall"
var apiKey ="e3de7b451ff3cdc179f2915141cb031b";
var lat;
var lon;
var tempSpan = $("#currTemp");
var windSpeedSpan = $("#currWind");
var humiditySpan = $("#currHumidity");
var uvIdxSpan = $("#currUvIndex");


function getCityTemp(){
    event.preventDefault()
    if (txtCity.val()) {
      var city = txtCity.val().trim()
      getLatLong(city);
      txtCity.val('')
    }
    else {
        lblCity.text("Invalid City. Please try again");
        resetVal();
    }   
}

function getLatLong(city) {
  
  var apiURL = geoAPI + "?q=" + city + "&limit=1&appid=" + apiKey;
  fetch(apiURL).then(function(response) {
    if (response.ok) {
      response.json().then(function(data) {
        if (Object.keys(data).length === 0) {
          debugger;
          lblCity.text("Invalid City. Please try again");
          resetVal();
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
  var ccURL = currConditionAPI + "?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&exclude=hourly,daily,minutely,alerts";
  
  fetch(ccURL).then(function(response) {
    if (response.status === 200) {
      response.json().then(function(data) {
        //console.log(KelvinToFahrenheit(data.main.temp));
        tempSpan.text(KelvinToFahrenheit(data.current.temp)+ '\u00B0 F');
        windSpeedSpan.text(MPStoMPH(data.current.wind_speed)+ ' MPH');
        humiditySpan.text(data.current.humidity+ '%');
        var uvIndex = parseFloat(data.current.uvi);
        uvIdxSpan.text(uvIndex);

        uvIdxSpan.removeClass();
        switch (true) {
          case (uvIndex<3):
            uvIdxSpan.addClass("rounded bg-success");
            break;
          case (uvIndex>=3 && uvIndex<6):
            uvIdxSpan.addClass("rounded bgYellow")
            break;
          case (uvIndex>=6 && uvIndex<8):
            uvIdxSpan.addClass("rounded bg-warning");
            break;
          case (uvIndex>=8 && uvIndex<11):
            uvIdxSpan.addClass("rounded bg-danger");
            break
          case (uvIndex>=11):
            uvIdxSpan.addClass("rounded bgDarkMagenta");
            break;
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

function KelvinToFahrenheit(temp) {
  //℉=((K-273.15)*1.8)+32
  return ((((temp-273.15)*1.8)+32).toFixed(2));
}

function MPStoMPH (speed) {
 return ((Math.round(speed * 3600 / 1610.3*1000)/1000).toFixed(2));
}

function resetVal() {
  tempSpan.text('');
  windSpeedSpan.text('');
  humiditySpan.text('');
  uvIdxSpan.text('');
}
