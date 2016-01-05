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

$(document).ready(function(){
  OWM.init(APIkey, 'imperial');
  OWM.queryByZip('current', '03861', 'us', function(response){
    var name = response['name'],
      currentTemp = Math.round(response['temperature']),
      humidity = response['humidity'],
      description = response['readableConditions'];
    $('#weather-name').text(name);
    $('#weather-current-temp').text(currentTemp + String.fromCharCode(176) + "F");
    $('#weather-description').text(description);
    $('#weather-current-icon').addClass(icons[response['conditionIcon']])
    $('#weather-humidity').text(humidity + "%");
  });
});