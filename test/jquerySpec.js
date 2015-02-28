var jquery = require('jquery');
var frag = require('../');
var expect = require('chai').expect;

var VNode = require('virtual-dom/vnode/vnode');
var VText = require('virtual-dom/vnode/vtext');
var htmlToVDom = require('html-to-vdom')({ VNode: VNode, VText: VText });

var $ = require('jquery')(require("jsdom").jsdom().parentWindow);

function fragQuery(html) {
  var vdom = htmlToVDom(html);
  return frag(function() { return vdom });
}

describe('frag(vdom) vs jquery(html)', function() {

  var html;

  beforeEach(function() {
    html = '<div id="a" class="a">' +
             '<div id="b" class="b">' +
               '<span class="c" d="e" e="ab- c de">X<span>Y</span></span>' +
               'ZZ' +
              '</div>' +
            '</div>';
  });

  assert('$.attr("id")', 'a');
  assert('$.find(".c").attr("d")', 'e');
  assert('$.find(".z, .b, .y").find(".c").attr("d")', 'e');
  assert('$.find(".b, .c").attr("d")', undefined);
  assert('$.attr("zz")', undefined);

  assert('$.children().size()', 1);

  assert('$.eq(0).attr("id")', "a");
  assert('$.eq(1).size()', 0);
  assert('$.eq(666).size()', 0);
  assert('$.eq(0).eq(0).size()', 1);
  assert('$.eq(0).eq(1).size()', 0);
  assert('$.find("*").eq(1).size()', 1);
  assert('$.find("*").eq(1).get().map(function(i) { return i.tagName.toUpperCase(); })', ['SPAN']);

  assert('$.find(".c").attr("d")', "e");
  assert('$.find(".b").attr("id")', "b");
  assert('$.find("#b .c").attr("class")', "c");
  assert('$.find("* > .c").attr("d")', "e");

  assert('$.first().attr("id")', "a");

  assert('$.get.constructor', Function);
  assert('$.get().map(function(i) { return i.tagName.toUpperCase(); })', ['DIV']);

  assert('$.hasClass("a")', true);
  assert('$.hasClass("z")', false);
  assert('$.find("x").hasClass("a")', false);
  assert('$.find("#b").hasClass("a")', false);
  assert('$.find("#b").hasClass("b")', true);
  assert('$.find("div, span").hasClass("a")', false);
  assert('$.find("div, span").hasClass("b")', true);
  assert('$.find("div, span").hasClass("c")', true);
  assert('$.find("div, span").hasClass("z")', false);

  assert('$.find("SPAN").size()', 2);
  assert('$.find("div, SPAN").size()', 3);

  assert('$.text()', 'XYZZ');
  assert('$.find("> *").text()', 'XYZZ');
  assert('$.find("z").text()', '');
  assert('$.find(".c").text()', 'XY');
  assert('$.find("*[d], *[e]").text()', 'XY');
  assert('$.find("div, span").text()', 'XYZZXYY');

  assert('$.size()', 1);
  assert('$.find("*").size()', 3);
  assert('$.find("div, span").size()', 3);
  assert('$.find("#a").size()', 0);
  assert('$.find(".b .c").size()', 1);
  assert('$.find(".b > .c").size()', 1);
  assert('$.find(".b > .c").size()', 1);

  assert('$.html().length', 87);
  assert('$.find("div").html()', '<span class="c" d="e" e="ab- c de">X<span>Y</span></span>ZZ');
  assert('$.find(":not(div)").html()', 'X<span>Y</span>');
  assert('$.find("z").html()', undefined);

  assert('$.find("y, div, .b").find("span").size()', 2);

  assert('$.find("*[e*=\'b\']").size()', 1);
  assert('$.find("*[e^=\'a\']").size()', 1);
  assert('$.find("*[e$=\'e\']").size()', 1);
  assert('$.find("*[e~=\'c\']").size()', 1);
  assert('$.find("*[e|=\'ab\']").size()', 1);

  assert('$.find("*[e*=\'x\']").size()', 0);
  assert('$.find("*[e^=\'x\']").size()', 0);
  assert('$.find("*[e$=\'x\']").size()', 0);
  assert('$.find("*[e~=\'x\']").size()', 0);
  assert('$.find("*[e|=\'x\']").size()', 0);

  function assert(expression, expected) {
    describe(expression, function() {
      it ('returns ' + expected, function() {
        expectLibraryResult("JQUERY", $, expression, expected);
        expectLibraryResult("FRAG", fragQuery, expression, expected);
      });
    });
  }

  function expectLibraryResult(library, $, expression, expected) {
    var test = function($) {
      return eval(expression);
    }
    try {
      result = test($(html));
    }
    catch (e) {
      e.message = "Error evaluating " + expression + " in " + library + ": " + e.message;
      throw e;
    }
    expect(result).to.eql(expected, "unexpected " + library + " result");
  }
})
