var expect = require('chai').expect;
var h = require('virtual-dom/h');
var $ = require('../');

describe('on()', function(){
  it('receives an event when one occurs', function(){
    var vdom = h('.x');

    return new Promise(function(success){
      $(vdom).find('.x').on('click', function(e){
        expect(e.type).to.equal('click');
        success();
      });
      $(vdom).find('.x').trigger('click');
    });
  });
});

describe('trigger()', function(){
  it('calls event handlers on element', function(){
    var clickEvent;
    var clickEventThis;
    var vdom = h('.x', {
      id: 'clicker',
      onclick: function(e){
        clickEvent = e;
        clickEventThis = this;
      }
    });

    $(vdom).find('.x').trigger('click');

    expect(clickEvent).to.not.be.undefined;
    expect(clickEventThis).to.equal(vdom);
    expect(clickEvent.target.id).to.equal('clicker');
  });

  it('bubbles events up through the parents', function(){
    var events = [];
    var vdom = h('parent', {
      onclick: function(e){
        events.push({event: 'parent', e: e});
      }
    }, h('child', {
      onclick: function(e) {
        events.push({event: 'child', e: e});
      }
    }));

    $(vdom).find('child').trigger('click');

    var child = events[0];
    expect(child.event).to.equal('child');
    expect(child.e.eventPhase).to.equal(2);
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

  describe('radio', function(){
    it('toggles the state of the radio control', function(){
      var vdom = h('input', {type: 'radio'});

      expect($(vdom).prop('checked')).to.be.false;
      $(vdom).trigger('click');
      expect($(vdom).prop('checked')).to.be.true;
    });

    describe('nested in label', function(){
      it('toggles the state of nested radio control', function(){
        var vdom = h('label', h('input', {type: 'radio'}));

        expect($(vdom).find('input').prop('checked')).to.be.false;
        $(vdom).trigger('click');
        expect($(vdom).find('input').prop('checked')).to.be.true;
      });
    });
  });

  describe('checkbox', function(){
    it('toggles the state of the checkbox', function(){
      var vdom = h('label', h('input', {type: 'checkbox'}));

      var $input = $(vdom).find('input');
      expect($input.prop('checked')).to.be.false;
      $input.trigger('click');
      expect($input.prop('checked')).to.be.true;
    });

    describe('nested in label', function(){
      it('toggles the state of nested checkboxes', function(){
        var vdom = h('label', h('input', {type: 'checkbox'}));

        var $input = $(vdom).find('input');
        expect($input.prop('checked')).to.be.false;
        $(vdom).trigger('click');
        expect($input.prop('checked')).to.be.true;
      });
    });
  });
});
