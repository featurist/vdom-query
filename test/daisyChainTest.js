var daisyChain = require('../daisyChain');
var expect = require('chai').expect;

describe('daisyChain', function() {
  it('performs a series of transformations on a list', function() {
    function append(a, b) {
      return this.concat([a, b]);
    }

    function prepend(a, b) {
      return [a, b].concat(this);
    }

    var $ = daisyChain([append, prepend]);
    var z = $([2, 3]).append(4, 5).prepend(0, 1);
    expect(JSON.stringify(z)).to.equal('[0,1,2,3,4,5]');
  });
});
