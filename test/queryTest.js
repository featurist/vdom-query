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
  it('is empty', function(){
    var vdom = h('.x');

    expect($(vdom).find('.y').size()).to.equal(0);
  });
  it('has some elements', function(){
    var vdom = h('.x', h('.y'));

    expect($(vdom).size()).to.equal(1);
  })
});

describe('hasClass()', function(){
  it('does no have a class', function(){
    var vdom = h('div');

    expect($(vdom).hasClass('x')).to.be.false;
  });
  it('has a class', function(){
    var vdom = h('.x');

    expect($(vdom).hasClass('x')).to.be.true;
  });
});

describe('attr()', function(){
  it('gets the attribute', function(){
    var vdom = h('div', {className: 'x', style: 'width:100px;'});

    expect($(vdom).attr('class')).to.equal('x');
    expect($(vdom).attr('style')).to.equal('width:100px;');
  });

  it('gets nothing when there is no attribute or node', function(){
    var vdom = h('.x');

    expect($(vdom).attr('id')).to.be.undefined;
    expect($(vdom).find('span').attr('style')).to.be.undefined;
  });
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
