var expect = require('chai').expect;
var plastiq = require('plastiq');
var h = plastiq.html;

var vdomQuery = require('..');

describe('plastiq.html()', function() {
  it('returns queryable vdoms', function() {
    var vdom = h('.foo', h('.bar'));
    var $ = vdomQuery(vdom);
    expect($('div.foo, div.bar').length).to.equal(2);
  })
});
