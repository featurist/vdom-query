var frag = require('../');
var h = require('virtual-dom/h');
var expect = require('chai').expect;

describe('frag(render)', function() {

  describe('.click(e)', function() {
    it('calls onclick(e) event handlers', function() {
      var clicks = [];

      function render() {
        return h('.clickable', {
          onclick: function(e) { clicks.push(e); },
        })
      }

      var f = frag(render);
      f.click(123);
      expect(clicks[0]).to.equal(123);
    })
  });

  describe('.outerHtml()', function() {
    it('returns the outer HTML of the first element', function() {
      function render() {
        return h('.x', {}, [h('.y', 'hello')])
      }

      var f = frag(render);
      expect(f.outerHtml()).to.equal(
        '<div class="x"><div class="y">hello</div></div>'
      );
    })
  });

  describe('.startOfChain()', function() {
    it('returns the start of the chain', function() {
      function render() {
        return h('.x', {}, [h('.y', 'hello')])
      }

      var f = frag(render);
      var p = f.slice(10, 11).eq(12).startOfChain();
      expect(p.outerHtml()).to.equal('<div class="x"><div class="y">hello</div></div>');
    })
  });

});
