var expect = require('chai').expect;
var plastiq = require('plastiq');
var h = plastiq.html;

var vdomQuery = require('..');

describe('plastiq.html()', function() {
  it('returns queryable vdoms', function() {
    var vdom = h('.foo', h('.bar'));
    var $ = vdomQuery(vdom);
    expect($('div.foo, div.bar').length).to.equal(2);
  });

  it('returns clickable elements', function() {
    var events = [];
    var vdom = h('.foo', h('.bar', { onclick: function(e) { events.push(e) } }));
    var $ = vdomQuery(vdom);
    $('.bar').click();
    $('.bar').click();
    expect(events.length).to.equal(2);
  });
});
