var frag = require('../');
var h = require('virtual-dom/h');
var expect = require('chai').expect;

describe('frag(render)', function() {

  var model = { clicks: 0 };

  function render() {
    return h('div#one.outer',
              {},
              [
                h('span#two.inner', {
                    onclick: function(e) { model.clicks+=e; },
                    x: '2'
                  },
                  h('.deep.dark', 'trouble')
                ),
                h('span#three.extra', 'strife')
              ]
            );
  }

  describe('.elements()', function() {
    it('finds the root element', function() {
      var elements = frag(render).elements();
      expect(elements.length).to.equal(1);
      expect(elements[0].tagName).to.equal('DIV');
    });
  });

  describe('.html()', function() {
    it('renders the innerHTML', function() {
      var html = frag(render).html();
      expect(html).to.equal(
        '<span x="2" id="two" class="inner">' +
        '<div class="deep dark">trouble</div></span>' +
        '<span id="three" class="extra">strife</span>'
      );
    });
  });

  describe(".hasClass('outer')", function() {
    it('returns true', function() {
      expect(frag(render).hasClass('outer')).to.equal(true);
    });
  });

  describe(".hasClass('inner')", function() {
    it('returns false', function() {
      expect(frag(render).hasClass('inner')).to.equal(false);
    });
  });

  function describeExpression(expression, description) {
    describe(expression, function() {
      eval("var f = frag(render)" + expression.trim());
      description(f);
    });
  }

  function describeEmpty(expression) {
    describeExpression(expression, function(f) {

      describe('.elements()', function() {
        it('finds no elements', function() {
          expect(f.elements().length).to.equal(0);
        });
      });

      describe(".find('*').elements()", function() {
        it('finds no elements', function() {
          expect(f.find('*').elements().length).to.equal(0);
        });
      });

      describe('.html()', function() {
        it('returns an empty string', function() {
          expect(f.html()).to.equal('');
        });
      });

      describe('.text()', function() {
        it('returns an empty string', function() {
          expect(f.text()).to.equal('');
        });
      });

      describe(".attr('x')", function() {
        it('returns undefined', function() {
          expect(f.attr('x')).to.equal(undefined);
        });
      });

      describe(".hasClass('foo')", function() {
        it('returns false', function() {
          expect(f.hasClass('foo')).to.equal(false);
        });
      });

      describe('.click(e)', function() {
        it('does nothing', function() {
          model.clicks = 0;
          f.click();
          expect(model.clicks).to.equal(0);
        });
      });

    });
  }

  describeEmpty(".find('missing')");
  describeEmpty(".find('.missing')");
  describeEmpty(".find('#missing')");
  describeEmpty(".find('* missing')");
  describeEmpty(".find('.outer missing')");
  describeEmpty(".find('[missing]')");


  function describeInner(expression) {
    describeExpression(expression, function(f) {

      describe('.elements()', function() {
        it('finds the inner element', function() {
          var elements = f.elements();
          expect(elements.length).to.equal(1);
          expect(elements[0].tagName).to.equal('SPAN');
        });
      });

      describe('.html()', function() {
        it('returns the innerHTML of the element', function() {
          expect(f.html()).to.equal('<div class="deep dark">trouble</div>');
        });
      });

      describe('.text()', function() {
        it('returns the innerText of the element', function() {
          expect(f.text()).to.equal('trouble');
        });
      });

      describe(".attr('x')", function() {
        it('returns 2', function() {
          expect(f.attr('x')).to.equal('2');
        });
      });

      describe(".hasClass('inner')", function() {
        it('returns true', function() {
          expect(f.hasClass('inner')).to.equal(true);
        });
      });

      describe('.click()', function() {
        it('calls element.properties.onclick(event)', function() {
          model.clicks = 0;
          f.click(1);
          expect(model.clicks).to.equal(1);
          f.click(1);
          expect(model.clicks).to.equal(2);
        });
      });

    });
  }

  describeInner(".find('.inner')");
  describeInner(".find('span.inner')");
  describeInner(".find('* SPAN#two.inner')");
  describeInner(".find('*[x]')");
  describeInner(".find('*[x=2]')");


  function describeDeep(expression) {
    describeExpression(expression, function(f) {

      describe('.elements()', function() {
        it('finds the deep element', function() {
          var elements = f.elements();
          expect(elements.length).to.equal(1);
          expect(elements[0].properties.className).to.equal('deep dark');
        });
      });

      describe('.html()', function() {
        it('returns the innerHTML of the element', function() {
          expect(f.html()).to.equal('trouble');
        });
      });

      describe('.text()', function() {
        it('returns the innerText of the element', function() {
          expect(f.text()).to.equal('trouble');
        });
      });

      describe(".attr('x')", function() {
        it('returns undefined', function() {
          expect(f.attr('x')).to.equal(undefined);
        });
      });

      describe('.click(e)', function() {
        it('does nothing', function() {
          model.clicks = 0;
          f.click();
          expect(model.clicks).to.equal(0);
        });
      });

    });
  }

  describeDeep(".find('.deep')");
  describeDeep(".find('div div')");
  describeDeep(".find('.inner > *')");
  describeDeep(".find('.deep.dark')");
  describeDeep(".find('.outer, .inner').find('.inner > .deep')");


  function describeDivs(expression) {
    describeExpression(expression, function(f) {

      describe('.elements()', function() {
        it('finds the div elements', function() {
          var elements = f.elements();
          expect(elements.length).to.equal(2);
          expect(elements[0].tagName).to.equal('DIV');
          expect(elements[1].tagName).to.equal('DIV');
        });
      });

      describe('.html()', function() {
        it('returns the innerHTML of the first element', function() {
          expect(f.html()).to.equal(
            '<span x="2" id="two" class="inner">' +
            '<div class="deep dark">trouble</div></span>' +
            '<span id="three" class="extra">strife</span>'
          );
        });
      });

      describe('.text()', function() {
        it('returns the joined innerTexts of all elements', function() {
          expect(f.text()).to.equal('troublestrife');
        });
      });

      describe(".attr('x')", function() {
        it('returns undefined', function() {
          expect(f.attr('x')).to.equal(undefined);
        });
      });

      describe(".hasClass('outer')", function() {
        it('returns true', function() {
          expect(f.hasClass('outer')).to.equal(true);
        });
      });

      describe('.click(e)', function() {
        it('does nothing', function() {
          model.clicks = 0;
          f.click();
          expect(model.clicks).to.equal(0);
        });
      });

    });
  }

  describeDivs(".find('DIV')");
  describeDivs(".find('div, OTHER')");
  describeDivs(".find('*:not(.inner, span)')");


  function describeSpans(expression) {
    describeExpression(expression, function(f) {

      describe('.elements()', function() {
        it('finds the span elements', function() {
          var elements = f.elements();
          expect(elements.length).to.equal(2);
          expect(elements[0].tagName).to.equal('SPAN');
          expect(elements[1].tagName).to.equal('SPAN');
        });
      });

      describe('.text()', function() {
        it('returns the joined innerTexts of all elements', function() {
          expect(f.text()).to.equal('troublestrife');
        });
      });

      describe(".attr('x')", function() {
        it('returns the attribute value', function() {
          expect(f.attr('x')).to.equal('2');
        });
      });

      describe(".hasClass('extra')", function() {
        it('returns true', function() {
          expect(f.hasClass('extra')).to.equal(true);
        });
      });

      describe('.click(e)', function() {
        it('calls element.properties.onclick(event)', function() {
          model.clicks = 0;
          f.click(1);
          expect(model.clicks).to.equal(1);
        });
      });

    });
  }

  describeSpans(".find('SPAN')");
  describeSpans(".find('*:not(div)')");

});
