var expect = require('chai').expect;
var h = require('virtual-dom/h');
var $ = require('../');

describe('find()', function(){
  it('can find an element by selector', function(){
    var vdom = h('.x', h('.x'));

    expect($(vdom).find('.x').length).to.equal(2);
  });

  it('can find nested elements', function(){
    var vdom = h('.x', h('.y'));

    expect($(vdom).find('.x').find('.y').length).to.equal(1);
  });
});

describe('text()', function(){
  it('can get the text of an element', function(){
    var vdom = h('.x', 'hello'); 

    expect($(vdom).find('.x').text()).to.equal('hello');
  });

  it('gets the text of an element and all its children', function(){
    var vdom = h('.x', ['hello', h('div', [' world', h('div', ' how'), h('div', ' are you')])]); 

    expect($(vdom).find('.x').text()).to.equal('hello world how are you');
  });
});

describe('size()', function(){
  it('has no children', function(){
    var vdom = h('.x');

    expect($(vdom).find('.x').size()).to.equal(0);
  });
  it('has some children', function(){
    var vdom = h('.x', h('.y'));

    expect($(vdom).size()).to.equal(1);
  })
});

describe('wrap', function(){
  it('can double wrap a vdom-query object', function(){
    var vdom = h('.x', 'hello'); 

    expect($($(vdom).find('.x')).text()).to.equal('hello');
  });

  it('can rescope a previous vdom-query object', function(){
    var vdom = h('.x', 'hello'); 

    expect($($(vdom)[0]).find('.x').text()).to.equal('hello');
  });
});
