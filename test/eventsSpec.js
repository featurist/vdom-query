var expect = require('chai').expect;
var h = require('virtual-dom/h');
var $ = require('../');

describe('on()', function(){
  it('receives an event when one occurs', function(){
    var vdom = h('.x');

    return new Promise(function(success){
      $(vdom).find('.x').on('click', function(){
        success(); 
      });
      $(vdom).find('.x').trigger('click');
    });
  });
});
