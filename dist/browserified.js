(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function createSpeeedometerMixin (execlib) {
  'use strict';

  var lib = execlib.lib;

  execlib.execSuite.libRegistry.register('allex_speedometerweblib', require('./mixincreator')(lib));
})(ALLEX);

},{"./mixincreator":2}],2:[function(require,module,exports){
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
    klass.prototype.postInitializationMethodNames = 
     klass.prototype.postInitializationMethodNames.concat(['initializeSpeedometer'])
  };

  SpeedometerMixin.prototype.set_speed = function (val) {
    this.speed = val;
    this.$element.setSpeed(val);
  };

  return SpeedometerMixin;
}
module.exports = createMixin;

},{"./speedometer":3}],3:[function(require,module,exports){
function speedometer (userPref) {
  var self = this;
  this.defaultProperty = {
    minVal              : 0,           /**Min value of the meter*/
    maxVal              : 180,         /**Max value of the meter*/
    divFact             : 10,          /**Division value of the meter*/
    dangerLevel         : 120,         /**more than this leval, color will be red*/
    initDeg             : -45,         /**reading begins angle*/
    maxDeg              : 270,         /**total angle of the meter reading*/
    edgeRadius          : 150,         /**radius of the meter circle*/
    speedNobeH          : 4,           /**speed nobe height*/
    speedoNobeW         : 95,          /**speed nobe width*/
    speedoNobeL         : 13,          /**speed nobe left position*/
    indicatorRadius     : 125,         /**radius of indicators position*/
    indicatorValuesRadius : 90,          /**radius of numbers position*/
    speedPositionTxtWH  : 80,          /**speedo-meter current value cont*/
    nobW                : 20,          /**indicator nob width*/
    nobH                : 4,           /**indicator nob height*/
    numbW               : 30,          /**indicator number width*/
    numbH               : 16,          /**indicator number height*/
    midNobW             : 10,          /**indicator mid nob width*/
    midNobH             : 3,           /**indicator mid nob height*/
    smallDivCount        : 2,           /**no of small div between main div*/
    eventListenerType   : 'change',    /**type of event listener*/
    multiplier          : 1,	       /**Center value multiplier e.g. 1 x 1000 RPM*/	
    gaugeText   	    : 'CURRENTVALUE<br />km/h'       /**Label on gauge Face*/	
  }
  if(typeof userPref === 'object')
  for (var prop in userPref)this.defaultProperty[prop] = userPref[prop];

  var speedInDeg,
  noOfDev            = (this.defaultProperty.maxVal-this.defaultProperty.minVal)/this.defaultProperty.divFact,
  divDeg             = this.defaultProperty.maxDeg/noOfDev,
  speedBgPosY,
  speedoWH           = this.defaultProperty.edgeRadius*2,
  speedNobeTop       = this.defaultProperty.edgeRadius - this.defaultProperty.speedNobeH/2,
  speedNobeAngle     = this.defaultProperty.initDeg,
  speedPositionTxtTL = this.defaultProperty.edgeRadius - this.defaultProperty.speedPositionTxtWH/2,
  tempDiv       = '',
  induCatorLinesPosY,induCatorLinesPosX,induCatorNumbPosY,induCatorNumbPosX,
  induCatorLinesPosLeft,induCatorLinesPosTop,induCatorNumbPosLeft,induCatorNumbPosTop;

  this.setCssProperty = function(){
    var tempStyleVar = [
      '<style>',
        '.envelope{',
          'width  :'+ speedoWH + 'px;',
          'height :'+ speedoWH + 'px;',
        '}',
        '.speedNobe{',
          'height            :'+ this.defaultProperty.speedNobeH + 'px;',
          'top               :'+ speedNobeTop + 'px;',
          'transform         :rotate('+speedNobeAngle+'deg);',
          '-webkit-transform :rotate('+speedNobeAngle+'deg);',
          '-moz-transform    :rotate('+speedNobeAngle+'deg);',
          '-o-transform      :rotate('+speedNobeAngle+'deg);',
        '}',
        '.speedPosition{',
          'width  :'+this.defaultProperty.speedPositionTxtWH + 'px;',
          'height :'+this.defaultProperty.speedPositionTxtWH + 'px;',
          'top  :'+speedPositionTxtTL + 'px;',
          'left :'+speedPositionTxtTL + 'px;',
        '}',
        '.speedNobe div{',
          'width  :'+ this.defaultProperty.speedoNobeW + 'px;',
          'left :'+ this.defaultProperty.speedoNobeL + 'px;',
        '}',      
        '.nob{',
          'width  :'+ this.defaultProperty.nobW + 'px;',
          'height :'+ this.defaultProperty.nobH + 'px;',
        '}',
        '.numb{',
          'width  :'+ this.defaultProperty.numbW + 'px;',
          'height :'+ this.defaultProperty.numbH + 'px;',
        '}',
        '.midNob{',
          'width  :'+ this.defaultProperty.midNobW + 'px;',
          'height :'+ this.defaultProperty.midNobH + 'px;',
        '}',
      '</style>',
    ].join('');
    this.parentElem.append(tempStyleVar);    
  }
  this.createSpeedometerElements = function() {
    this.parentElem = $(this);
    this.setCssProperty();
    this.createIndicators();
  };
  this.createIndicators = function(){
    for(var i=0; i<=noOfDev; i++){
      var curDeg = this.defaultProperty.initDeg + i*divDeg;
      var curIndVal = i*this.defaultProperty.divFact;
      var dangCls = "";
      if(curIndVal >= this.defaultProperty.dangerLevel){
        dangCls = "danger";
      }   
      var induCatorLinesPosY = this.defaultProperty.indicatorRadius * Math.cos( 0.01746 * curDeg);
      var induCatorLinesPosX = this.defaultProperty.indicatorRadius * Math.sin( 0.01746 * curDeg);
      
      var induCatorNumbPosY = this.defaultProperty.indicatorValuesRadius * Math.cos( 0.01746 * curDeg);
      var induCatorNumbPosX = this.defaultProperty.indicatorValuesRadius * Math.sin( 0.01746 * curDeg);
      
      if(i%this.defaultProperty.smallDivCount == 0){
        induCatorLinesPosLeft = (this.defaultProperty.edgeRadius - induCatorLinesPosX )-2;
        induCatorLinesPosTop  = (this.defaultProperty.edgeRadius - induCatorLinesPosY)-10;
        var tempDegInd = [
                  'transform         :rotate('+curDeg+'deg)',
                  '-webkit-transform :rotate('+curDeg+'deg)',
                  '-o-transform      :rotate('+curDeg+'deg)',
                  '-moz-transform    :rotate('+curDeg+'deg)',
                ].join(";");
        tempDiv += '<div class="nob '+dangCls+'" style="left:'+induCatorLinesPosTop+'px;top:'+induCatorLinesPosLeft+'px;'+tempDegInd+'"></div>';
        induCatorNumbPosLeft = (this.defaultProperty.edgeRadius - induCatorNumbPosX) - (this.defaultProperty.numbW/2);
        induCatorNumbPosTop  = (this.defaultProperty.edgeRadius - induCatorNumbPosY) - (this.defaultProperty.numbH/2);
        tempDiv += '<div class="numb numb-'+i+' '+dangCls+'" style="left:'+ induCatorNumbPosTop +'px;top:'+induCatorNumbPosLeft+'px;">'+ curIndVal +'</div>';
      }else{
        induCatorLinesPosLeft = (this.defaultProperty.edgeRadius - induCatorLinesPosX )-(this.defaultProperty.midNobH/2);
        induCatorLinesPosTop = (this.defaultProperty.edgeRadius - induCatorLinesPosY)-(this.defaultProperty.midNobW/2);
        var tempDegInd = [
                  'transform         :rotate('+curDeg+'deg)',
                  '-webkit-transform :rotate('+curDeg+'deg)',
                  '-o-transform      :rotate('+curDeg+'deg)',
                  '-moz-transform    :rotate('+curDeg+'deg)',
                ].join(";");
        tempDiv += '<div class="nob '+dangCls+' midNob" style="left:'+induCatorLinesPosTop+'px;top:'+induCatorLinesPosLeft+'px;'+tempDegInd+'"></div>';
        tempDiv += '<div class="numb"></div>';
      }
    }
    this.parentElem.append('<div class="envelope">');
    
    var speedNobe = [
      '<div class="speedNobe">',
        '<div></div>',
      '</div>',
      '<div class="speedPosition"></div>'
    ].join('\n');

    this.parentElem.find(".envelope").append(speedNobe+tempDiv);
  };
  this.setSpeed = function (speed){
    if(speed > self.defaultProperty.maxVal){
      speed = self.defaultProperty.maxVal;
    }
    if(speed < 0 || isNaN(speed)){
      speed = 0;
    }
    speedInDeg = (self.defaultProperty.maxDeg/self.defaultProperty.maxVal)*speed + self.defaultProperty.initDeg;
    
    self.parentElem.find(".speedNobe").css({
      "-webkit-transform" :'rotate('+speedInDeg+'deg)',
      "-webkit-transform" :'rotate('+speedInDeg+'deg)',
      "-moz-transform"    :'rotate('+speedInDeg+'deg)',
      "-o-transform"      :'rotate('+speedInDeg+'deg)'
    });
    
    var centerVal = speed *  self.defaultProperty.multiplier;
    //self.parentElem.find(".speedPosition").html(centerVal + self.defaultProperty.gaugeLabel );
    self.parentElem.find(".speedPosition").html(self.defaultProperty.gaugeText.replace('CURRENTVALUE', centerVal));
    
    self.parentElem.find(".envelope .nob,.envelope .numb").removeClass("bright");
    for(var i=0; i<=noOfDev; i++){
      if(speed >= i*self.defaultProperty.divFact){
        self.parentElem.find(".envelope .nob").eq(i).addClass("bright");
        self.parentElem.find(".envelope .numb").eq(i).addClass("bright");
      }else{
        break;
      }
    }
  };
  this.createSpeedometerElements();
  return this;
}

module.exports = speedometer;

},{}]},{},[1]);
