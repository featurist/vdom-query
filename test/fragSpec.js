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

});
