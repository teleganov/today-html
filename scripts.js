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
var timeString = moment().format("hh:mm");


var updateTime = function(){
  dateString = moment().format("MMMM Do, YYYY");
  dayString  = moment().format("dddd");
  timeString = moment().format("hh:mm A");
  $('#date-string').text(dateString);
  $('#day-string').text(dayString);
  $('#time-string').text(timeString);
};
var updateWeather = function(){
  OWM.queryByZip('current', '03861', 'us', function(response){
    var name = response['name'],
      currentTemp = Math.round(response['temperature']),
      humidity = response['humidity'],
      wind = Math.round(response['windSpeed']) + 'mph' + ' ' + response['windDirectionText'],
      cloudiness = response['cloudiness'],
      precip = response['rainVolume'] + response['snowVolume'],
      description = response['readableConditions'];
    if(!cloudiness) cloudiness = 0;
    if(!precip) precip = 0;
    $('#weather-name').text(name);
    $('#weather-current-temp').text(currentTemp + String.fromCharCode(176) + "F");
    $('#weather-description').text(description);
    $('#weather-current-icon').attr('class', 'wi ' + icons[response['conditionIcon']])
    $('#weather-humidity').text('Humidity: ' + humidity + "%");
    $('#weather-wind').text('Wind: ' + wind);
    $('#weather-cloudiness').text('Clouds: ' + cloudiness + "%");
    $('#weather-precip').text('Precip: ' + precip + " in");
  });
  OWM.queryByZip('forecast', '03861', 'us', function(response){
    console.log(response);
    var periods = [response['data'][0], response['data'][1], response['data'][2], response['data'][3]];
    periods.forEach(function(period){
      console.log(moment(period['time'] * 1000).format("hA"));
    });
  });
}

$(document).ready(function(){
  // Date and Time
  updateTime();
  setInterval(updateTime, 5000);

  // WEATHER
  OWM.init(APIkey, 'imperial');
  updateWeather();
  setInterval(updateWeather, 60000);
});