var expect = require('chai').expect;
var h = require('virtual-dom/h');
var $ = require('../');

describe('on()', function(){
  it('receives an event when one occurs', function(){
    var vdom = h('.x');

    return new Promise(function(success){
      $(vdom).find('.x').on('click', function(){
        expect(this).to.equal(vdom);
        success(); 
      });
      $(vdom).find('.x').trigger('click');
    });
  });
});

describe('trigger()', function(){
  it('calls event handlers on element', function(){
    var events = [];
    var vdom = h('.x', {
      onclick: function(){
        events.push('click');
      }
    });

    $(vdom).find('.x').trigger('click');

    expect(events).to.contain('click');
  });
});
