$(document).ready(function(){
  $.get('http://api.openweathermap.org/data/2.5/weather?zip=' + zipCode + ',us&units=imperial&APPID=' + APIkey, function(response){
    console.log(response);
    var name = response['name'],
      currentTemp = Math.round(response['main']['temp']),
      humidity = response['main']['humidity'];
    $('#weather-name').text(name);
    $('#weather-current-temp').text(currentTemp + String.fromCharCode(176) + "F");
    $('#weather-humidity').text(humidity + "%");
  });
});