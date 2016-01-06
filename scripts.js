var icons = {
  '01d': 'wi-day-sunny',
  '01n': 'wi-night-clear',
  '02d': 'wi-day-cloudy',
  '02n': 'wi-night-cloudy',
  '03d': 'wi-cloud',
  '03n': 'wi-cloud',
  '04d': 'wi-cloudy',
  '04n': 'wi-cloudy',
  '09d': 'wi-showers',
  '09n': 'wi-showers',
  '10d': 'wi-rain',
  '10n': 'wi-rain',
  '11d': 'wi-thunderstorm',
  '11n': 'wi-thunderstorm',
  '13d': 'wi-snow',
  '13n': 'wi-snow',
  '50d': 'wi-fog',
  '50n': 'wi-fog',

}
var dateString = moment().format("MMMM Do, YYYY");
var dayString  = moment().format("dddd");
var hourString = moment().format("hh");
var minuteString = moment().format("mm A");


var updateTime = function(){
  dateString = moment().format("MMMM Do, YYYY");
  dayString  = moment().format("dddd");
  hourString = moment().format("hh");
  minuteString = moment().format("mm A");
  $('#date-string').text(dateString);
  $('#day-string').text(dayString);
  $('#time-hour').text(hourString);
  $('#time-separator').toggleClass('active');
  $('#time-minutes').text(minuteString);
};
var updateWeather = function(){
  OWM.queryByZip('current', '03861', 'us', function(response){
    var name = response['name'],
      currentTemp = Math.round(response['temperature']),
      humidity = response['humidity'],
      wind = Math.round(response['windSpeed']) + 'mph' + ' ' + response['windDirectionText'],
      cloudiness = response['cloudiness'],
      precip = response['rainVolume'] + response['snowVolume'],
      sunrise = moment(response['sunriseTime'] * 1000).format('h:mm a'),
      sunset = moment(response['sunsetTime'] * 1000).format('h:mm a'),
      description = response['readableConditions'];
    if(!cloudiness) cloudiness = 0;
    if(!precip) precip = 0;
    $('#weather-name').text(name);
    $('#weather-current-temp').text(currentTemp + String.fromCharCode(176) + "F");
    $('#weather-description').text(description);
    $('#weather-current-icon').attr('class', 'wi ' + icons[response['conditionIcon']])
    $('#weather-humidity').find('span').text(humidity + "%");
    $('#weather-wind').find('span').text(wind);
    $('#weather-cloudiness').find('span').text(cloudiness + "%");
    $('#weather-precip').find('span').text(precip + " in");
    $('#weather-sunrise').find('span').text(sunrise);
    $('#weather-sunset').find('span').text(sunset);
  });
  OWM.queryByZip('forecast', '03861', 'us', function(response){
    console.log(response);
    var periods = [response['data'][0], response['data'][1], response['data'][2], response['data'][3]];
    for(var i = 1; i < 5; i++){
      var period = periods[i-1];
      var temp = Math.round(period['temperature']),
        time = moment(period['time'] * 1000).format("hA"),
        wind = Math.round(period['windSpeed']) + 'mph' + ' ' + period['windDirectionText'],
        precip = period['rainVolume'] + period['snowVolume'];
      if(!precip) precip = 0;
      $('#forecast-' + i).find('.forecast-li-left').text(time);
      $('#forecast-' + i).find('.forecast-li-temp').text(temp + String.fromCharCode(176) + "F");
      $('#forecast-' + i).find('.forecast-li-icon').find('i').attr('class', 'wi ' + icons[period['conditionIcon']])
      $('#forecast-' + i).find('.forecast-li-wind').text(wind);
      $('#forecast-' + i).find('.forecast-li-precip').text(precip + " in");
    }
  });
}

$(document).ready(function(){
  // Date and Time
  updateTime();
  setInterval(updateTime, 500);

  // Weather
  OWM.init(APIkey, 'imperial');
  updateWeather();
  setInterval(updateWeather, 60000); // update weather every minute
});