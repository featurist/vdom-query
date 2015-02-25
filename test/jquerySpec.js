var jquery = require('jquery');
var frag = require('../');
var expect = require('chai').expect;

var VNode = require('virtual-dom/vnode/vnode');
var VText = require('virtual-dom/vnode/vtext');
var vdomFor = require('html-to-vdom')({ VNode: VNode, VText: VText });

var $ = require('jquery')(require("jsdom").jsdom().parentWindow);

function fragQuery(html) {
  var vdom = vdomFor(html);
  return frag(function() { return vdom });
}

describe('frag(vdom) vs jquery(html)', function() {

  var html;

  beforeEach(function() {
    html = '<div id="a" class="a">' +
             '<div id="b" class="b">' +
               '<span class="c" d="e">XX</span>' +
               'YY' +
              '</div>' +
            '</div>';
  });

  assert('.attr("id")', 'a');
  assert('.find(".c").attr("d")', 'e');
  assert('.find(".b, .c").attr("d")', undefined);
  assert('.attr("zz")', undefined);

  assert('.eq(0).attr("id")', "a");
  assert('.eq(1).size()', 0);
  assert('.eq(666).size()', 0);
  assert('.find("*").eq(1).size()', 1);
  assert('.find("*").eq(1).get().map(function(i) { return i.tagName.toUpperCase(); })', ['SPAN']);

  assert('.find(".c").attr("d")', "e");
  assert('.find(".b").attr("id")', "b");
  assert('.find("#b .c").attr("class")', "c");
  assert('.find("* > .c").attr("d")', "e");

  assert('.get.constructor', Function);
  assert('.get().map(function(i) { return i.tagName.toUpperCase(); })', ['DIV']);

  assert('.hasClass("a")', true);
  assert('.hasClass("z")', false);
  assert('.find("x").hasClass("a")', false);
  assert('.find("#b").hasClass("a")', false);
  assert('.find("#b").hasClass("b")', true);
  assert('.find("div, span").hasClass("a")', false);
  assert('.find("div, span").hasClass("b")', true);
  assert('.find("div, span").hasClass("c")', true);
  assert('.find("div, span").hasClass("z")', false);

  assert('.text()', 'XXYY');
  assert('.find("> *").text()', 'XXYY');
  assert('.find("z").text()', '');
  assert('.find(".c").text()', 'XX');

  assert('.size()', 1);
  assert('.find("*").size()', 2);
  assert('.find("#a").size()', 0);
  assert('.find(".b .c").size()', 1);
  assert('.find(".b > .c").size()', 1);

  assert('.html().length', 61);
  assert('.find("div").html()', '<span class="c" d="e">XX</span>YY');
  assert('.find(":not(div)").html()', 'XX');
  assert('.find("z").html()', undefined);

  function assert(expression, expected) {
    describe(expression, function() {
      var test = function($) {
        return eval('$' + expression);
      }
      it ('returns ' + expected, function() {
        var jqueryResult = test($(html));
        expect(jqueryResult).to.eql(expected, "unexpected JQUERY result");

        var fragResult = test(fragQuery(html));
        expect(fragResult).to.eql(expected, "unexpected FRAG result");
      });
    });
  }

})
