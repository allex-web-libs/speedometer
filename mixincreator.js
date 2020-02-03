var speedometer = require('./speedometer');
function createMixin (lib) {
  'use strict';

  function SpeedometerMixin (options) {
    this.speed = (options && 'speed' in options) ? options.speed : 0;
    this.speedclicker = this.onSpeedNobClicked.bind(this);
  }
  SpeedometerMixin.prototype.destroy = function () {
    if (this.speedclicker && this.$element) {
      this.$element.off('click', this.speedclicker);
    }
    this.speedclicker = null;
    this.speed = null;
  };

  SpeedometerMixin.prototype.initializeSpeedometer = function () {
    jQuery.fn.speedometer = speedometer;
    this.$element.speedometer(this.getConfigVal('speedometer')||null);
    this.$element.setSpeed(this.speed);
    this.$element.on('click', this.speedclicker);
  };

  SpeedometerMixin.prototype.onSpeedNobClicked = function (evnt, speed) {
    if (lib.isNumber(speed)) {
      this.set('speed', speed);
    }
  };

  SpeedometerMixin.prototype.set_speed = function (val) {
    this.speed = val;
    this.$element.setSpeed(val);
  };

  SpeedometerMixin.addMethods = function (klass) {
    lib.inheritMethods(klass, SpeedometerMixin
      ,'initializeSpeedometer'
      ,'onSpeedNobClicked'
      ,'set_speed'
    );
    klass.prototype.postInitializationMethodNames = 
     klass.prototype.postInitializationMethodNames.concat(['initializeSpeedometer'])
  };

  return SpeedometerMixin;
}
module.exports = createMixin;
