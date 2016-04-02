var expect = require('chai').expect;
var h = require('virtual-dom/h');
var $ = require('../');

describe('append()', function(){
  it('can append a vdom node to a vdom node', function(){
    var vdom = h('body');

    $(vdom).append($('<div class="x">hello</div>'));
    expect($(vdom).find('.x').length).to.equal(1);
    expect($(vdom).find('.x').text()).to.equal('hello');
  });

  it('can append text to a node', function(){
    var vdom = h('body');

    $(vdom).append('<div class="x">hello</div>');
    expect($(vdom).find('.x').length).to.equal(1);
    expect($(vdom).find('.x').text()).to.equal('hello');
  });

  it('can append and find siblings', function(){
    var vdom = h('body');

    $(vdom).append('<div><span>a</span><span>b</span></div>');
    expect($(vdom).find('span').length).to.equal(2);
  });
});

describe('prop()', function(){
  describe('disabled', function(){
    it('sets true', function(){
      var vdom = h('input');

      $(vdom).prop('disabled', true)
      expect($(vdom).attr('disabled')).to.equal('disabled');
    });

    it('gets true when disabled', function(){
      var vdom = h('input');

      $(vdom).prop('disabled', true)
      expect($(vdom).prop('disabled')).to.be.true;
    });

    it('gets false when not disabled', function(){
      var vdom = h('input');

      expect($(vdom).prop('disabled')).to.be.false;
    });
  });

  describe('tagName', function(){
    it('gets tag names', function(){
      var vdom = h('input', h('div'));
      expect($(vdom).find('input').prop('tagName')).to.equal('INPUT');
      expect($(vdom).find('div').prop('tagName')).to.equal('DIV');
    });
  });
});

describe('addClass()', function(){
  it('adds a class', function(){
    var vdom = h('div');
    $(vdom).addClass('green');
    expect($(vdom).hasClass('green')).to.be.true;
  });
});
