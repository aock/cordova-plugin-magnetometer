var argscheck = require('cordova/argscheck'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec'),
    timers = {};

var Magnetometer = function(){

}

Magnetometer.prototype = {
  getReading: function(successCallback, errorCallback){
    // TODO: Instead of single reading, this currently adds a watch on iOS
    cordova.exec(successCallback, errorCallback, "Magnetometer", "getReading", []);
  },
  watchReadings: function(successCallback, errorCallback, options){
    // Start watch timer to get magnitude
    var magnetometer = this,
        id = utils.createUUID();
    if (cordova.platformId === 'android') {
      // TODO: Instead of using setInterval it would be ideal if Android code
      // executes callback directly from sensor listener.
      var interval = 40;
       
      if( typeof options !== 'undefined' && 'interval' in options)
      {
        interval = options['interval'];
      }
       
      timers[id] = window.setInterval(function() {
          magnetometer.getReading(successCallback, errorCallback);
      }, interval); // every 40 ms (25 fps)
    } 
    else cordova.exec(successCallback, errorCallback, "Magnetometer", "watchReadings", []);
    return id;
  },
  stop: function(watchID) {
    if (cordova.platformId === 'android') {
      if (watchID) {
        // Stop a single watch
        window.clearInterval(timers[watchID]);
        delete timers.watchID;
      } else {
        // Or stop all watches
        for (var id in timers) {
          window.clearInterval(timers[id]);
          delete timers.id;
        }
      }
    }
    else cordova.exec(function() {}, function() {throw "Error stopping magnetometer"}, "Magnetometer", "stop", []);
  }
}

module.exports = new Magnetometer();
