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
  '50n': 'wi-fog'
};
var dateString = moment().format("MMMM Do, YYYY");
var dayString  = moment().format("dddd");
var hourString = moment().format("hh");
var minuteString = moment().format("mm A");
var currentDay;

var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
if(moment().isLeapYear()) daysInMonth[1] = 29;

var updateCalendar = function(){
  var today = moment();
  if(today.format("D") === currentDay) return; // don't do all this work if the day has not changed.
  currentDay = today.format("D");
  var todayDate = parseInt(today.format('D'));
  var month = parseInt(today.format('M')) - 1;
  var firstDayOfMonth = moment(today.format('YYYY-MM'))
  var prevMonth = month - 1;
  var nextMonth = month + 1;
  if(prevMonth < 0) prevMonth += 12;
  if(nextMonth > 11) nextMonth -= 12;

  var firstDayOfWeek = parseInt(firstDayOfMonth.format('d'));

  var dayLayout = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0]
  ];

  var prevDayCounter = daysInMonth[prevMonth];
  var currDayCounter = 1;
  var weekCounter = 0, weekDay = 0;
  var todayLocation = [0, 0];
  var nextMonthLocation = [0, 0];

  // fill in the first week
  for(var a = firstDayOfWeek - 1; a >= 0; a--) {
    dayLayout[0][a] = prevDayCounter;
    prevDayCounter--;
  }
  for(var b = firstDayOfWeek; b < 7; b++) {
    dayLayout[0][b] = currDayCounter;
    if(currDayCounter === todayDate) todayLocation = [weekCounter, weekDay];
    currDayCounter++;
  }

  weekCounter = 1;
  // fill in the second through last week of current month
  for(var c = currDayCounter; c < daysInMonth[month] + 1; c++) {
    dayLayout[weekCounter][weekDay] = c;
    currDayCounter = c;
    if(currDayCounter === todayDate) todayLocation = [weekCounter, weekDay];
    weekDay++;
    if(weekDay > 6){
      weekDay = 0;
      weekCounter++;
    }
  }

  // fill in remainder of next month
  nextMonthLocation = [weekCounter, weekDay];
  for(var d = 1; d < daysInMonth[nextMonth] + 1; d++) {
    dayLayout[weekCounter][weekDay] = d;
    weekDay++;
    if(weekDay > 6){
      weekDay = 0;
      weekCounter++;
    }
    if(weekCounter > 5) break;
  }

  var enableGreying = false;

  var rows = $('#calendar-container').find('.calendar-row');
  for(var i = 0; i < rows.length; i++) {
    var row = rows[i];
    for(var k = 1; k < 8; k++) {
      var identifier = '.calendar-row-td-' + k;
      var td = $(row).find(identifier);
      td.text(dayLayout[i][k-1]);
      if(i == 0 && k-1 < firstDayOfWeek) td.attr('class', identifier + ' greyed');
      if(todayLocation[0] == i && todayLocation[1] == k-1) td.attr('class', identifier + ' today');
      if(i > nextMonthLocation[0] || ( i == nextMonthLocation[0] && k-1 >= nextMonthLocation[1])) td.attr('class', identifier + ' greyed');
    }
  }
}

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
  updateCalendar();
  setInterval(updateTime, 500);
  setInterval(updateCalendar, 60000); // check every minute

  // Weather
  OWM.init(APIkey, 'imperial');
  updateWeather();
  setInterval(updateWeather, 60000); // update weather every minute
});