var v$ = require('../');
var jquery = require('jquery');
var chai = require('chai');
var h = require('virtual-dom/h');

var html = '<a><b><c x="1"><d x="1" /></c><e /></b></a>';
var vdom = h('a', h('b', h('c', { x: '1' }, h('d', { x: '1' })), h('e')));
var $ = jquery(require("jsdom").jsdom().parentWindow);

xdescribe("like jQuery, $('" + html + "')", function() {
  expect('.find("a").length', 0);
  expect('.find("b").length', 1);
  expect('.find("a, b").length', 1);
  expect('.find("a b c").length', 0);
  expect('.find("b c > d").length', 1);
});

function expect(expression, expected) {
  it(expression + ' returns ' + expected, function() {
    expectLibraryResult("jQuery", '$(html)' + expression, expected);
    expectLibraryResult("vdomQuery", 'v$(vdom)' + expression, expected);
  });
}

function expectLibraryResult(library, expression, expected) {
  var result;
  try {
    result = eval(expression);
  }
  catch (e) {
    e.message = "Error in " + expression + " in " + library + ": " + e.message;
    throw e;
  }
  chai.expect(result).to.eql(expected, "unexpected " + library + " result");
}
