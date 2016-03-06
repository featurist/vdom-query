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
});
