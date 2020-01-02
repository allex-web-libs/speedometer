var speedometer = require('./speedometer');
function createMixin (lib) {
  'use strict';

  function SpeedometerMixin (options) {
    this.speed = (options && 'speed' in options) ? options.speed : 0;
  }
  SpeedometerMixin.prototype.destroy = function () {
  };

  SpeedometerMixin.prototype.initializeSpeedometer = function () {
    jQuery.fn.speedometer = speedometer;
    this.$element.speedometer(this.getConfigVal('speedometer')||null);
    this.$element.setSpeed(this.speed);
  };

  SpeedometerMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, SpeedometerMixin
      ,'initializeSpeedometer'
    );
    klass.prototype.postInitializationMethodNames.push('initializeSpeedometer')
  };

  SpeedometerMixin.prototype.set_speed = function (val) {
    this.speed = val;
    this.$element.setSpeed(val);
  };

  return SpeedometerMixin;
}
module.exports = createMixin;
