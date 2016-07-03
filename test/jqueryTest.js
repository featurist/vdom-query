var expect = require('chai').expect;

var htmlToVDom = require('html-to-vdom')({
  VNode: require('virtual-dom/vnode/vnode'),
  VText: require('virtual-dom/vnode/vtext')
});

var html =  '<html>' +
              '<head></head>' +
              '<body id="main">' +
                '<div class="a">' +
                  '<div class="b">' +
                    '<span class="c" d="e" e="ab- c de">X<span>Y</span></span>' +
                    'ZZ' +
                  '</div>' +
                  '<div class="d">DD</div>' +
                  '<div class="e">EE</div>' +
                '</div>' +
              '</body>' +
            '</html>';

describe('with ' + html, function() {

  describe('$(selector)', function() {
    assert(function($) { return $('SPAN').length }, 2);
    assert(function($) { return $('span').length }, 2);
    assert(function($) { return $('.a').length }, 1);
    assert(function($) { return $('[class]').length }, 5);
    assert(function($) { return $('*[id]').length }, 1);
    assert(function($) { return $('.c[d]').length }, 1);
    assert(function($) { return $('.c[d=e]').length }, 1);
    assert(function($) { return $('.c[d=z]').length }, 0);
    assert(function($) { return $('div span').length }, 2);
    assert(function($) { return $('.a .b > .c').length }, 1);
    assert(function($) { return $('div > span').length }, 1);
    assert(function($) { return $('div, span').length }, 6);
    assert(function($) { return $('.a, .b').length }, 2);
    assert(function($) { return $('.a, .zzz').length }, 1);
    assert(function($) { return $('.b + .d').length }, 1);
    assert(function($) { return $('.b + .e').length }, 0);
    assert(function($) { return $('.b ~ .d').length }, 1);
    assert(function($) { return $('.d ~ .b').length }, 0);
  });

  describe('$($(selector))', function() {
    assert(function($) { return $($('SPAN')).length }, 2);
    assert(function($) { return $([$('span').get(0), $('div').get(0)]).length }, 2);
  });

  describe('.attr(name)', function() {
    assert(function($) { return $('body').attr('id') }, 'main');
    assert(function($) { return $('.a').attr('class') }, 'a');
    assert(function($) { return $('.c').attr('e') }, 'ab- c de');
    assert(function($) { return $('.a').attr('missing') }, undefined);
  });

  describe('.children([selector])', function() {
    assert(function($) { return $('.a').children('missing').length }, 0);
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
    assert(function($) { return $('span').filter(function() { return true; }).length }, 2);
  });

  describe('.find(selector)', function() {
    assert(function($) { return $('.a').find('.b .c').length }, 1);
    assert(function($) { return $('.a').find('.zzz').length }, 0);
    assert(function($) { return $('.a').find('.b').find('.c').length }, 1);
    assert(function($) { return $('.a').find('.b').find('.zzz').length }, 0);
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

  describe('.hasClass(name)', function() {
    assert(function($) { return $('.a').hasClass('a') }, true);
    assert(function($) { return $('.a').hasClass('b') }, false);
    assert(function($) { return $('.yo').hasClass('b') }, false);
    assert(function($) { return $('.a, .b').hasClass('a') }, true);
    assert(function($) { return $('.a, .b').hasClass('b') }, true);
  });

  describe('.html()', function() {
    assert(function($) { return $('.c').html() }, 'X<span>Y</span>');
    assert(function($) { return $('.c, .d').html() }, 'X<span>Y</span>');
    assert(function($) { return $('span span').html() }, 'Y');
    assert(function($) { return $('.yo').html() }, undefined);
    assert(function($) { return $('html').html().length }, 183);
  });

  describe('.is(selector)', function() {
    assert(function($) { return $('div.a').is('.a') }, true);
    assert(function($) { return $('div').is('div') }, true);
    assert(function($) { return $('div.b').is('.a, div') }, true);
    assert(function($) { return $('div').is('span') }, false);
  });

  describe('.last()', function() {
    assert(function($) { return $('*').last().length }, 1);
    assert(function($) { return $('zz').last().length }, 0);
    assert(function($) { return $('.b, .a').last().attr('class') }, 'b');
  });

  describe('.map(function)', function() {
    assert(function($) { return $('.a').map(function() { return $(this).attr('class'); }).get() }, ['a']);
    assert(function($) { return $('div').map(function(i) { return i; }).get() }, [0,1,2,3]);
  });

  describe('.next([selector])', function() {
    assert(function($) { return $('.b').next().length }, 1);
    assert(function($) { return $('.a').next().length }, 0);
    assert(function($) { return $('.b').next('.d').length }, 1);
    assert(function($) { return $('.b').next('.e').length }, 0);
  });

  describe('.nextAll([selector])', function() {
    assert(function($) { return $('.b').nextAll().length }, 2);
    assert(function($) { return $('.d').nextAll().length }, 1);
    assert(function($) { return $('.c').nextAll().length }, 0);
    assert(function($) { return $('.b').nextAll('.d').length }, 1);
    assert(function($) { return $('.b').nextAll('.d, .e').length }, 2);
    assert(function($) { return $('.b').nextAll('.z').length }, 0);
  });

  describe('.not(selector)', function() {
    assert(function($) { return $('.a, .b, .c').not('.b').length }, 2);
    assert(function($) { return $('.a, .b').not('.a').not('.b').length }, 0);
    assert(function($) { return $('.c').not('.c').length }, 0);
    assert(function($) { return $('*').not('*').length }, 0);
  });

  describe('.parent([selector])', function() {
    assert(function($) { return $('.c').parent().length }, 1);
    assert(function($) { return $('html').parent().parent().get(0) }, undefined);
    assert(function($) { return $('.z').parent().length }, 0);
    assert(function($) { return $('.c').parent('.b').length }, 1);
    assert(function($) { return $('.c').parent('*').length }, 1);
    assert(function($) { return $('.c').parent('.zz').length }, 0);
  });

  describe('.parents([selector])', function() {
    assert(function($) { return $('.c').parents().length }, 4);
    assert(function($) { return $('.c').parents('div').length }, 2);
    assert(function($) { return $('.c').parents('html').length }, 1);
  });

  describe('.prev([selector])', function() {
    assert(function($) { return $('.d').prev().length }, 1);
    assert(function($) { return $('.a').prev().length }, 0);
    assert(function($) { return $('.d').prev('.b').length }, 1);
    assert(function($) { return $('.a').prev('.e').length }, 0);
  });

  describe('.prevAll([selector])', function() {
    assert(function($) { return $('.e').prevAll().length }, 2);
    assert(function($) { return $('.e').prevAll('.b').length }, 1);
    assert(function($) { return $('.d').prevAll('.b, .e').length }, 1);
    assert(function($) { return $('.e').prevAll('.z').length }, 0);
    assert(function($) { return $('.y').prevAll('.z').length }, 0);
  });

  describe('.siblings([selector])', function() {
    assert(function($) { return $('.e').siblings().length }, 2);
    assert(function($) { return $('.d').siblings('.b, .e').length }, 2);
    assert(function($) { return $('.e').siblings('.z').length }, 0);
    assert(function($) { return $('.y').siblings('.z').length }, 0);
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
});
