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
    var clickEvent;
    var vdom = h('.x', {
      onclick: function(e){
        clickEvent = e;
      }
    });

    $(vdom).find('.x').trigger('click');

    expect(clickEvent).to.not.be.undefined;
    expect(clickEvent.target).to.equal(vdom);
  });

  it('bubbles events up through the parents', function(){
    var events = [];
    var vdom = h('.parent', {
      onclick: function(){
        events.push('parent');
      }
    }, h('.child', {
      onclick: function() {
        events.push('child');
      }
    }));

    $(vdom).find('.child').trigger('click');

    expect(events).to.eql(['child', 'parent']);
  });

  it('adds context data to event', function(){
    var eventInfo;
    var vdom = h('.x', {
      onkeydown: function(e){
        eventInfo = e;
      }
    });

    $(vdom).find('.x').trigger('keydown', {which: 50});

    expect(eventInfo.which).to.equal(50);
  });

  describe('checkbox', function(){
    it('toggles the state of the checkbox', function(){
      var vdom = h('input', {type: 'checkbox'});

      expect($(vdom).prop('checked')).to.be.false;
      $(vdom).trigger('click');
      expect($(vdom).prop('checked')).to.be.true;
    });

    describe('nested in label', function(){
      it('toggles the state of nested checkboxes', function(){
        var vdom = h('label', h('input', {type: 'checkbox'}));

        expect($(vdom).find('input').prop('checked')).to.be.false;
        $(vdom).trigger('click');
        expect($(vdom).find('input').prop('checked')).to.be.true;
      });
    });
  });
});
