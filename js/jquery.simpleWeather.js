/*! simpleWeather v3.1.0 - http://simpleweatherjs.com */
(function($) {
  'use strict';

  function getAltTemp(unit, temp) {
    if(unit === 'f') {
      return Math.round((5.0/9.0)*(temp-32.0));
    } else {
      return Math.round((9.0/5.0)*temp+32.0);
    }
  }

  $.extend({
    simpleWeather: function(options){
      options = $.extend({
        location: '',
        woeid: '',
        unit: 'f',
        success: function(weather){},
        error: function(message){}
      }, options);

      var now = new Date();
      var weatherUrl = 'https://query.yahooapis.com/v1/public/yql?format=json&rnd=' + now.getFullYear() + now.getMonth() + now.getDay() + now.getHours() + '&diagnostics=true&callback=?&q=';

      if(options.location !== '') {
        /* If latitude/longitude coordinates, need to format a little different. */
        var location = '';
        if(/^(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)$/.test(options.location)) {
          location = '(' + options.location + ')';
        } else {
          location = options.location;
        }

        weatherUrl += 'select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + location + '") and u="' + options.unit + '"';
      } else if(options.woeid !== '') {
        weatherUrl += 'select * from weather.forecast where woeid=' + options.woeid + ' and u="' + options.unit + '"';
      } else {
        options.error('Could not retrieve weather due to an invalid location.');
        return false;
      }

      $.getJSON(
        encodeURI(weatherUrl),
        function(data) {
          if(data !== null && data.query !== null && data.query.results !== null && data.query.results.channel.description !== 'Yahoo! Weather Error') {
            var result = data.query.results.channel,
                weather = {},
                forecast,
                compass = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW', 'N'],
                image404 = 'https://s.yimg.com/os/mit/media/m/weather/images/icons/l/44d-100567.png';

            weather.title = result.item.title;
            weather.temp = result.item.condition.temp;
            weather.code = result.item.condition.code;
            weather.todayCode = result.item.forecast[0].code;
            weather.currently = result.item.condition.text;
            weather.high = result.item.forecast[0].high;
            weather.low = result.item.forecast[0].low;
            weather.text = result.item.forecast[0].text;
            weather.humidity = result.atmosphere.humidity;
            weather.pressure = result.atmosphere.pressure;
            weather.rising = result.atmosphere.rising;
            weather.visibility = result.atmosphere.visibility;
            weather.sunrise = result.astronomy.sunrise;
            weather.sunset = result.astronomy.sunset;
            weather.description = result.item.description;
            weather.city = result.location.city;
            weather.country = result.location.country;
            weather.region = result.location.region;
            weather.updated = result.item.pubDate;
            weather.link = result.item.link;
            weather.units = {temp: result.units.temperature, distance: result.units.distance, pressure: result.units.pressure, speed: result.units.speed};
            weather.wind = {chill: result.wind.chill, direction: compass[Math.round(result.wind.direction / 22.5)], speed: result.wind.speed};
	    //var WC = result.item.condition.code;
	    var WC = 24;
			
			if (WC == 23 || WC == 24 || WC == 25 || WC == 32 || WC == 34 || WC == 36) {
				document.getElementById("weather").style.background = "url(../img/weatherback.jpg)";
				document.getElementById("weather").style.backgroundRepeat = "no-repeat";
			}
			else if (WC == 5 || WC == 7 || WC == 13 || WC == 14 || WC == 15 || WC == 16 || WC == 41 || WC == 42 || WC == 43 || WC == 46) {
				document.getElementById("weather").style.background = "url(../img/winterback.jpg)";
				document.getElementById("weather").style.backgroundRepeat = "no-repeat";
			}
			else if (WC == 0 || WC == 1 || WC == 2 || WC == 3 || WC == 4 || WC == 17 || WC == 37 || WC == 38 || WC == 39 || WC == 45 || WC == 47) {
				document.getElementById("weather").style.background = "url(../img/stormback.jpg)";
				document.getElementById("weather").style.backgroundRepeat = "no-repeat";
			}
			else if (WC == 30 || WC == 44) {
				document.getElementById("weather").style.background = "url(../img/partlycloudyback.jpg)";
				document.getElementById("weather").style.backgroundRepeat = "no-repeat";
			}
			else if (WC == 27 || WC == 29) {
				document.getElementById("weather").style.background = "url(../img/nightcloudyback.jpg)";
				document.getElementById("weather").style.backgroundRepeat = "no-repeat";
			}
			else if (WC == 31 || WC == 33) {
				document.getElementById("weather").style.background = "url(../img/nightclearback.jpg)";
				document.getElementById("weather").style.backgroundRepeat = "no-repeat";
			}
			else if (WC == 8 || WC == 10) {
				document.getElementById("weather").style.background = "url(../img/iceback.jpg)";
				document.getElementById("weather").style.backgroundRepeat = "no-repeat";
			}
			else if (WC == 6 || WC == 11 || WC == 12 || WC == 18 || WC == 35 || WC == 40) {
				document.getElementById("weather").style.background = "url(../img/heavyrainback.jpg)";
				document.getElementById("weather").style.backgroundRepeat = "no-repeat";
			}
			else if (WC == 19 || WC == 20 || WC == 21 || WC == 22) {
				document.getElementById("weather").style.background = "url(../img/fogback.jpg)";
				document.getElementById("weather").style.backgroundRepeat = "no-repeat";
			}
			else if (WC == 9) {
				document.getElementById("weather").style.background = "url(../img/drizzleback.jpg)";
				document.getElementById("weather").style.backgroundRepeat = "no-repeat";
			}
			else if (WC == 26 || WC == 28) {
				document.getElementById("weather").style.background = "url(../img/cloudyback.jpg)";
				document.getElementById("weather").style.backgroundRepeat = "no-repeat";
			};
            if(result.item.condition.temp < 80 && result.atmosphere.humidity < 40) {
              weather.heatindex = -42.379+2.04901523*result.item.condition.temp+10.14333127*result.atmosphere.humidity-0.22475541*result.item.condition.temp*result.atmosphere.humidity-6.83783*(Math.pow(10, -3))*(Math.pow(result.item.condition.temp, 2))-5.481717*(Math.pow(10, -2))*(Math.pow(result.atmosphere.humidity, 2))+1.22874*(Math.pow(10, -3))*(Math.pow(result.item.condition.temp, 2))*result.atmosphere.humidity+8.5282*(Math.pow(10, -4))*result.item.condition.temp*(Math.pow(result.atmosphere.humidity, 2))-1.99*(Math.pow(10, -6))*(Math.pow(result.item.condition.temp, 2))*(Math.pow(result.atmosphere.humidity,2));
            } else {
              weather.heatindex = result.item.condition.temp;
            }

            if(result.item.condition.code == '3200') {
              weather.thumbnail = image404;
              weather.image = image404;
            } else {
              weather.thumbnail = 'https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/' + result.item.condition.code + 'ds.png';
              weather.image = 'https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/' + result.item.condition.code + 'd.png';
            }

            weather.alt = {temp: getAltTemp(options.unit, result.item.condition.temp), high: getAltTemp(options.unit, result.item.forecast[0].high), low: getAltTemp(options.unit, result.item.forecast[0].low)};
            if(options.unit === 'f') {
              weather.alt.unit = 'c';
            } else {
              weather.alt.unit = 'f';
            }

            weather.forecast = [];
            for(var i=0;i<result.item.forecast.length;i++) {
              forecast = result.item.forecast[i];
              forecast.alt = {high: getAltTemp(options.unit, result.item.forecast[i].high), low: getAltTemp(options.unit, result.item.forecast[i].low)};

              if(result.item.forecast[i].code == "3200") {
                forecast.thumbnail = image404;
                forecast.image = image404;
              } else {
                forecast.thumbnail = 'https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/' + result.item.forecast[i].code + 'ds.png';
                forecast.image = 'https://s.yimg.com/zz/combo?a/i/us/nws/weather/gr/' + result.item.forecast[i].code + 'd.png';
              }

              weather.forecast.push(forecast);
            }

            options.success(weather);
          } else {
            options.error('There was a problem retrieving the latest weather information.');
          }
        }
      );
      return this;
    }
  });
})(jQuery);
