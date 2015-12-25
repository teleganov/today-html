$(document).ready(function(){
  OWM.init(APIkey, 'imperial');
  OWM.currentByZip('03861', 'us', function(response){
    var name = response['name'],
      currentTemp = Math.round(response['main']['temp']),
      humidity = response['main']['humidity'];
    $('#weather-name').text(name);
    $('#weather-current-temp').text(currentTemp + String.fromCharCode(176) + "F");
    $('#weather-humidity').text(humidity + "%");
  });
});