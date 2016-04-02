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

  it('can find multiple siblings', function(){
    var vdom = h('div', [
      h('span', 'a'),
      h('span', 'b')
    ]);

    expect($(vdom).find('span').length).to.equal(2);
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

describe('val()', function(){
  it('can get the value of a select box', function(){
    var vdom = h('select', [h('option', 'one'), h('option', {selected: 'selected'}, 'two')]);

    expect($(vdom).val()).to.equal('two');
  });

  describe('input', function() {
    it('can get the value of an input field', function(){
      var vdom = h('input', {type: 'text', value: 'hello'});

      expect($(vdom).val()).to.equal('hello');
    });

    it('can set the value of an input field', function(){
      var vdom = h('input', {type: 'text'});

      $(vdom).val('hello');

      expect(vdom.properties.value).to.equal('hello');
    });

    it('can reset the value of an input field', function(){
      var vdom = h('input', {type: 'text', value: 'hi'});

      $(vdom).val('');

      expect(vdom.properties.value).to.equal('');
    });
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

describe('is()', function(){
  it('matches when a child contains the expression', function(){
    var vdom = h('body', h('div.x'));

    expect($(vdom).is('.x')).to.be.true;
  });

  it('does not match when a child does not contain the expression', function(){
    var vdom = h('body');

    expect($(vdom).is('.x')).to.be.false;
  });
})

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

describe('parent()', function(){
  it('finds an elements parent', function(){
    var vdom = h('body', h('.x', h('.y', h('.z'))));
    expect($(vdom).find('.z').parent().attr('class')).to.equal('y');
  })
})

describe('remove()', function(){
  it('can remove a node from the vdom', function(){
    var vdom = h('body', h('.x'));
    $(vdom).find('.x').remove();
    expect($(vdom).find('.x').length).to.equal(0);
  });

  it('can remove all matching nodes from the vdom', function(){
    var vdom = h('body', [h('.x'), h('.x'), h('.x')]);
    $(vdom).find('.x').remove();
    expect($(vdom).find('.x').length).to.equal(0);
  });
});

describe('focus()', function(){
  it('can focus on an element', function(){
    var vdom = h('input', {type: 'text'});
    var focused = false;
    $(vdom).on('focus', function(){
      focused = true;
    });

    $(vdom).focus();

    expect(focused).to.be.true
  });
});
