var OWM = {
  apiKey: null,
  url: 'http://api.openweathermap.org/data/2.5/',
  units: 'imperial',
  ready: true,
  checkValidity: function(){
    if(!window.jQuery){
      console.error('OWM: jQuery is not loaded!');
      this.ready = false;
    }
    if(!this.apiKey){
      console.error('OWM: Missing API key!');
      this.ready = false;
    }
    if(this.apiKey && window.jQuery){
      this.ready = true;
    }
  },
  init: function(apiKey, units){
    if(!apiKey){
      console.error('OWM: Missing OpenWeatherMap API Key when calling "init"');
      return;
    }
    this.apiKey = apiKey;
    if(units) this.units = units;
  },
  filterResponse: function(response) {
    return response;
  },
  currentByZip: function(zipcode, country, callback){
    if(!zipcode || !country) console.error('OWM: Missing parameters when calling "currentByZip"');
    this.checkValidity();
    if(this.ready){
      var queryURL = this.url + 'weather?zip=' + zipcode + ',' + country;
      queryURL += '&units=' + this.units + '&APPID=' + this.apiKey;
      var that = this;
      $.get(queryURL, function(response){
        console.log(response);
        callback(that.filterResponse(response));
      });
    }
  },
  currentByCoord: function(longitude, latitude, callback){
    if(!longitude || !latitude) console.error('OWM: Missing parameters when calling "currentByCoord"');
    this.checkValidity();
    if(this.ready){
      var queryURL = this.url + 'weather?lat=' + latitude + '&lon=' + longitude;
      queryURL += '&units=' + this.units + '&APPID=' + this.apiKey;
      var that = this;
      $.get(queryURL, function(response){
        console.log(response);
        callback(this.filterResponse(response));
      });
    }
  },
  request: function(type, params, callback){
    if(!type) console.error('OWM: Missing request type when calling "request"');
    if(!params) console.error('OWM: Missing request parameters list when calling "request"');
    this.checkValidity();
    if(this.ready){
      var queryString = '';
      var queryURL = this.url + type + '?';
      Object.keys(params).forEach(function(key){
        this.updateQuery(queryString, key, params[key]);
      });
      queryURL += queryString;
      var that = this;
      $.get(queryURL, function(response){
        console.log(response);
        callback(this.filterResponse(response));
      });
    }
  },
  updateQuery: function(query, key, value) {
    var regex = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var sep = query.indexOf('?') !== -1 ? "&" : "?";
    if(query.match(regex)) {
      return query.replace(regex, '$1' + key + "=" + value + '$2');
    } else {
      return query + sep + key + "=" + value;
    }
  }
};