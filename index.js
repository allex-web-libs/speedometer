(function createSpeeedometerMixin (execlib) {
  'use strict';

  var lib = execlib.lib;

  execlib.execSuite.libRegistry.register('allex_speedometerweblib', require('./mixincreator')(lib));
})(ALLEX);
