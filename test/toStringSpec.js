var jquery = require('jquery');
var frag = require('../');
var expect = require('chai').expect;

function assert(input, output) {
  if (output == undefined) {
    output = input;
  }
  describe(input + '.toString()', function() {
    it('returns ' + output, function() {
      expect(eval(input).toString()).to.equal(output);
    })
  });
}

var dollar = frag(function() { return []; });
var V$ = dollar.find.bind(dollar);

assert('V$("x")')
assert('V$("x").eq(1)')
assert('V$("x").eq(1)')
assert('V$("x").find("y")', 'V$("x y")')
assert('V$("x y").eq(0).has("z")')
assert('V$("x").eq(0).find("y").eq(1)')
