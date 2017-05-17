var daisyChain = require('../daisyChain');
var expect = require('chai').expect;

describe('daisyChain', function() {
  it('performs a series of transformations on a list', function() {
    function append(a, b) {
      return this.toArray().concat([a, b]);
    }

    function prepend(a, b) {
      return [a, b].concat(this.toArray());
    }

    var $ = daisyChain([append, prepend]);
    var z = $([2, 3]).append(4, 5).prepend(0, 1);
    expect(JSON.stringify(z.toArray())).to.equal('[0,1,2,3,4,5]');
  });

  it('defines a method that does not return a daisy', function(){
    function hello(){
      return 'hi';
    }
    var $ = daisyChain([], [hello]);
    expect($().hello()).to.equal('hi');
  });
});
