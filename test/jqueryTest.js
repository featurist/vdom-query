var expect = require('chai').expect;

var htmlToVDom = require('html-to-vdom')({
  VNode: require('virtual-dom/vnode/vnode'),
  VText: require('virtual-dom/vnode/vtext')
});

var html = '<div id="a" class="a">' +
             '<div id="b" class="b">' +
               '<span class="c" d="e" e="ab- c de">X<span>Y</span></span>' +
               'ZZ' +
             '</div>' +
             '<div id="d" class="d">DD</div>' +
           '</div>';

describe('with ' + html, function() {

  describe('$(selector)', function() {
    assert(function($) { return $('SPAN').length }, 2);
    assert(function($) { return $('span').length }, 2);
    assert(function($) { return $('.a').length }, 1);
    assert(function($) { return $('#a').length }, 1);
    assert(function($) { return $('#a, .a').length }, 1);
    assert(function($) { return $('div span').length }, 2);
    assert(function($) { return $('div > span').length }, 1);
    assert(function($) { return $('div, span').length }, 5);
    assert(function($) { return $('.a, .b').length }, 2);
    assert(function($) { return $('.b + .d').length }, 1);
    assert(function($) { return $('.b + .e').length }, 0);
    assert(function($) { return $('.b ~ .d').length }, 1);
    assert(function($) { return $('.d ~ .b').length }, 0);
    assert(function($) { return tagNamesOf($('.a, .b, .c')) }, ['div', 'div', 'span']);
  });

  describe('$($(selector))', function() {
    assert(function($) { return $($('SPAN')).length }, 2);
    assert(function($) { return $([$('span').get(0), $('div').get(0)]).length }, 2);
  });

  describe('.attr(name)', function() {
    assert(function($) { return $('#a').attr('id') }, 'a');
    assert(function($) { return $('#a').attr('class') }, 'a');
    assert(function($) { return $('.c').attr('e') }, 'ab- c de');
    assert(function($) { return $('#a').attr('missing') }, undefined);
  });

  describe('.children([selector])', function() {
    assert(function($) { return $('#a').children('missing').length }, 0);
    assert(function($) { return $('div').children('div').children('span').length }, 1);
    assert(function($) { return $('div, span').children('span').length }, 2);
    assert(function($) { return $('missing').children('*').length }, 0);
  });

  describe('.eq(index)', function() {
    assert(function($) { return $('zzz').eq(1).length }, 0);
    assert(function($) { return $('.a, .b, .c').eq(1).length }, 1);
    assert(function($) { return $('.a, .b').eq(1).eq(0).eq(0).length }, 1);
  });

  describe('.filter(predicate)', function() {
    assert(function($) { return $('div, span').filter(function() { return false; }).length }, 0);
    assert(function($) { return $('div, span').filter(function() { return true; }).length }, 5);
  });

  describe('.find(selector)', function() {
    assert(function($) { return $('#a').find('.b .c').length }, 1);
    assert(function($) { return $('#a').find('.zzz').length }, 0);
    assert(function($) { return $('#a').find('.b').find('.c').length }, 1);
    assert(function($) { return $('#a').find('.b').find('.zzz').length }, 0);
  });

  describe('.first()', function() {
    assert(function($) { return $('*').first().length }, 1);
    assert(function($) { return $('zz').first().length }, 0);
    assert(function($) { return $('.b, .a').first().attr('class') }, 'a');
  });

  describe('.get([index])', function() {
    assert(function($) { return $('zzz').get() }, []);
    assert(function($) { return $('span').get().length }, 2);
    assert(function($) { return $('zzz').get(0) }, undefined);
    assert(function($) { return $('.a').get(0).length }, undefined);
  });

  describe('.has(selector)', function() {
    assert(function($) { return $('.a').has('.a').length }, 0);
    assert(function($) { return $('.a').has('.b').length }, 1);
    assert(function($) { return $('.a, .b').has('.c').length }, 2);
    assert(function($) { return $('div').has('div').length }, 1);
    assert(function($) { return $('div').has('span').length }, 2);
    assert(function($) { return $('span').has('span').length }, 1);
    assert(function($) { return $('span').has('div').length }, 0);
  });

  describe('.is(selector)', function() {
    assert(function($) { return $('div.a').is('#a') }, true);
    assert(function($) { return $('div').is('div') }, true);
    assert(function($) { return $('div').is('span') }, false);
  });

  describe('.last()', function() {
    assert(function($) { return $('*').last().length }, 1);
    assert(function($) { return $('zz').last().length }, 0);
    assert(function($) { return $('.b, .a').last().attr('class') }, 'b');
  });

  describe('.map(function)', function() {
    assert(function($) { return $('.a').map(function() { return $(this).attr('class'); }).get() }, ['a']);
    assert(function($) { return $('div').map(function(i) { return i; }).get() }, [0,1,2]);
  });

  describe('.next([selector])', function() {
    assert(function($) { return $('.b').next().length }, 1);
    assert(function($) { return $('.a').next().length }, 0);
    assert(function($) { return $('.b').next('.d').length }, 1);
    assert(function($) { return $('.b').next('.e').length }, 0);
  });

  describe('.not(selector)', function() {
    assert(function($) { return $('.a, .b, .c').not('.b').length }, 2);
    assert(function($) { return $('.a, .b').not('.a').not('.b').length }, 0);
    assert(function($) { return $('.c').not('.c').length }, 0);
    assert(function($) { return $('*').not('*').length }, 0);
  });

  describe('.parent([selector])', function() {
    assert(function($) { return $('.c').parent().length }, 1);
    assert(function($) { return $('.c').parent('.b').length }, 1);
    assert(function($) { return $('.c').parent('*').length }, 1);
    assert(function($) { return $('.c').parent('.zz').length }, 0);
  });

  describe('.prev([selector])', function() {
    assert(function($) { return $('.d').prev().length }, 1);
    assert(function($) { return $('.a').prev().length }, 0);
    assert(function($) { return $('.d').prev('.b').length }, 1);
    assert(function($) { return $('.a').prev('.e').length }, 0);
  });

  describe('.slice(start [, end])', function() {
    assert(function($) { return $('.a, .b, .c').slice(1).length }, 2);
    assert(function($) { return $('.a, .b, .c').slice(1, 2).length }, 1);
    assert(function($) { return $('.a, .b, .c').slice(0, 2).length }, 2);
    assert(function($) { return $('*').slice(2, 5).length }, 3);
    assert(function($) { return $('*').slice(-1, 2).length }, 0);
  });

  var jQuery, vdomQuery;

  before(function() {
    var jsdom = require('jsdom').jsdom;
    var document = jsdom(html, {});
    var window = document.defaultView;
    jQuery = require('jquery')(window);

    var parser = require('vdom-parser');
    var vdom = htmlToVDom(html);
    vdomQuery = require('..')(vdom);
  });

  function withEachLibrary(library) {
    library('jQuery', function() { return jQuery; });
    library('vdomQuery', function() { return vdomQuery; });
  }

  function assert(fn, expectedValue) {
    var expression = fn.toString()
      .replace(/^function \(\$\) { return\s+/, '')
      .replace(/\s*}\s*$/, '')

    describe(expression, function() {
      withEachLibrary(function(name, factory) {
        it('is ' + JSON.stringify(expectedValue) + ' in ' + name, function() {
          expect(fn(factory())).to.eql(expectedValue);
        });
      })
    })
  }

  function tagNamesOf(query) {
    return query.get().map(function(el) {
      return (el.tagName || el.name).toLowerCase();
    });
  }
});
