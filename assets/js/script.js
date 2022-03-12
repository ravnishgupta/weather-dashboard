var btnSearch = $("#search");
var txtCity = $("#city")
var lblCity = $("#cityLabel");
var geoAPI = "http://api.openweathermap.org/geo/1.0/direct";
var weatherAPI = "http://api.openweathermap.org/data/2.5/forecast";
var currConditionAPI = "http://api.openweathermap.org/data/2.5/onecall"
var iconURL = "http://openweathermap.org/img/wn/"
var apiKey ="e3de7b451ff3cdc179f2915141cb031b";
var lat;
var lon;
var tempSpan = $("#currTemp");
var windSpeedSpan = $("#currWind");
var humiditySpan = $("#currHumidity");
var uvIdxSpan = $("#currUvIndex");
var iconImg = $('<img id="dynamic">');

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
  var ccURL = currConditionAPI + "?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&exclude=hourly,minutely,alerts&units=imperial";
  
  fetch(ccURL).then(function(response) {
    if (response.status === 200) {
      response.json().then(function(data) {
        lblCity.text(lblCity.text() + ' (' + moment.unix(data.current.dt).format("MM/DD/YYYY") + ')');
        iconImg.attr('src', iconURL + data.current.weather[0].icon + ".png");
        iconImg.appendTo(lblCity);
        set5dayForecast(data);
        tempSpan.text(data.current.temp + '\u00B0 F');
        windSpeedSpan.text(data.current.wind_speed+ ' MPH'); 
        humiditySpan.text(data.current.humidity+ '%');
        var uvIndex = parseFloat(data.current.uvi);
        uvIdxSpan.text(uvIndex);

        uvIdxSpan.removeClass();
        switch (true) {
          case (uvIndex<3):
            uvIdxSpan.addClass("rounded bg-success text-light");
            break;
          case (uvIndex>=3 && uvIndex<6):
            uvIdxSpan.addClass("rounded bgYellow text-dark")
            break;
          case (uvIndex>=6 && uvIndex<8):
            uvIdxSpan.addClass("rounded bg-warning text-light");
            break;
          case (uvIndex>=8 && uvIndex<11):
            uvIdxSpan.addClass("rounded bg-danger text-light");
            break
          case (uvIndex>=11):
            uvIdxSpan.addClass("rounded bgDarkMagenta text-light");
            break;
        }
        
      })
      saveCity(lblCity.text().trim());
      showRecentSearches();
    }
    //else alert("Unable to connect to Open Weather. Please try again later.");
  })
  // .catch(function(error) {
  //   // Notice this `.catch()` getting chained onto the end of the `.then()` method
  //   alert("Unable to connect to Open Weather. Please try again later.");
  // })
}

function showRecentSearches() {
  debugger;
  var myDiv = document.getElementById("recentSearches");
  removeAllChildNodes(myDiv);
  if (localStorage.getItem('citySearch')) {
    existing = localStorage.getItem('citySearch').split(';');
    for (var i=0; i<existing.length; i++) {
      var searchButton = document.createElement("button");
      if (existing[i].trim().length>0) {
        searchButton.innerText = existing[i];
        myDiv.appendChild(searchButton);
      }
    }
  }
}

function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}

function saveCity(cityName) {
  var tmp = ''
  var existing = [];
  if (localStorage.getItem('citySearch')) {
    existing = localStorage.getItem('citySearch').split(';');
    tmp = localStorage.getItem('citySearch');
  }
  if (existing.indexOf(cityName) === -1){
    tmp += cityName + ";";
    localStorage.setItem('citySearch', tmp);
  }
}

function resetVal() {
  tempSpan.text('');
  windSpeedSpan.text('');
  humiditySpan.text('');
  uvIdxSpan.text('');
}

function set5dayForecast(data) {

  var date1 = $("#dt1");
  var icon1 = $("#icon1");
  var temp1 = $("#temp1");
  var wind1 = $("#wind1");
  var humidity1 = $("#hum1");
  var icon1Img = $('<img id="day1Img">');

  icon1Img.attr('src', iconURL + data.daily[1].weather[0].icon + ".png");
  icon1.text('');
  icon1Img.appendTo(icon1);

  date1.text(moment.unix(data.daily[1].dt).format("MM/DD/YYYY"));
  temp1.text(data.daily[1].temp.day + '\u00B0 F');
  wind1.text(data.daily[1].wind_speed + " MPH");
  humidity1.text(data.daily[1].humidity + " %");


  var date2 = $("#dt2");
  var icon2 = $("#icon2");
  var temp2 = $("#temp2");
  var wind2 = $("#wind2");
  var humidity2 = $("#hum2");
  var icon2Img = $('<img id="day2Img">');

  date2.text(moment.unix(data.daily[2].dt).format("MM/DD/YYYY"));
  icon2Img.attr('src', iconURL + data.daily[2].weather[0].icon + ".png");
  icon2.text('');
  icon2Img.appendTo(icon2);

  temp2.text(data.daily[2].temp.day + '\u00B0 F');
  wind2.text(data.daily[2].wind_speed + " MPH");
  humidity2.text(data.daily[2].humidity + " %");

  var date3 = $("#dt3");
  var icon3 = $("#icon3");
  var temp3 = $("#temp3");
  var wind3 = $("#wind3");
  var humidity3 = $("#hum3");
  var icon3Img = $('<img id="day3Img">');

  date3.text(moment.unix(data.daily[3].dt).format("MM/DD/YYYY"));
  icon3Img.attr('src', iconURL + data.daily[3].weather[0].icon + ".png");
  icon3.text('');
  icon3Img.appendTo(icon3);

  temp3.text(data.daily[3].temp.day + '\u00B0 F');
  wind3.text(data.daily[3].wind_speed + " MPH");
  humidity3.text(data.daily[3].humidity + " %");

  var date4 = $("#dt4");
  var icon4 = $("#icon4");
  var temp4 = $("#temp4");
  var wind4 = $("#wind4");
  var humidity4 = $("#hum4");
  var icon4Img = $('<img id="day4Img">');

  date4.text(moment.unix(data.daily[4].dt).format("MM/DD/YYYY"));
  icon4Img.attr('src', iconURL + data.daily[4].weather[0].icon + ".png");
  icon4.text('');
  icon4Img.appendTo(icon4);

  temp4.text(data.daily[4].temp.day + '\u00B0 F');
  wind4.text(data.daily[4].wind_speed + " MPH");
  humidity4.text(data.daily[4].humidity + " %");

  var date5 = $("#dt5");
  var icon5 = $("#icon5");
  var temp5 = $("#temp5");
  var wind5 = $("#wind5");
  var humidity5 = $("#hum5");
  var icon5Img = $('<img id="day5Img">');

  date5.text(moment.unix(data.daily[5].dt).format("MM/DD/YYYY"));
  icon5Img.attr('src', iconURL + data.daily[5].weather[0].icon + ".png");
  icon5.text('');
  icon5Img.appendTo(icon5);

  temp5.text(data.daily[5].temp.day + '\u00B0 F');
  wind5.text(data.daily[5].wind_speed + " MPH");
  humidity5.text(data.daily[5].humidity + " %");
}