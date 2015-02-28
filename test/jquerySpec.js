var jquery = require('jquery');
var frag = require('../');
var expect = require('chai').expect;

var VNode = require('virtual-dom/vnode/vnode');
var VText = require('virtual-dom/vnode/vtext');
var htmlToVDom = require('html-to-vdom')({ VNode: VNode, VText: VText });

var $ = require('jquery')(require("jsdom").jsdom().parentWindow);

function fragQuery(html) {
  if (typeof(html) == 'string') {
    var vdom = htmlToVDom(html);
    return frag(function() { return vdom });
  } else {
    return frag(function() { return html; })
  }
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

  assert('$(html).attr("id")', 'a');
  assert('$(html).find(".c").attr("d")', 'e');
  assert('$(html).find(".z, .b, .y").find(".c").attr("d")', 'e');
  assert('$(html).find(".b, .c").attr("d")', undefined);
  assert('$(html).attr("zz")', undefined);

  assert('$(html).children().size()', 1);

  assert('$(html).eq(0).attr("id")', "a");
  assert('$(html).eq(1).size()', 0);
  assert('$(html).eq(666).size()', 0);
  assert('$(html).eq(0).eq(0).size()', 1);
  assert('$(html).eq(0).eq(1).size()', 0);
  assert('$(html).find("*").eq(1).size()', 1);
  assert('$(html).find("*").eq(1).get().map(function(i) { return i.tagName.toUpperCase(); })', ['SPAN']);

  assert('$(html).find(".c").attr("d")', "e");
  assert('$(html).find(".b").attr("id")', "b");
  assert('$(html).find("#b .c").attr("class")', "c");
  assert('$(html).find("* > .c").attr("d")', "e");

  assert('$(html).first().attr("id")', "a");

  assert('$(html).get.constructor', Function);
  assert('$(html).get().map(function(i) { return i.tagName.toUpperCase(); })', ['DIV']);

  assert('$(html).hasClass("a")', true);
  assert('$(html).hasClass("z")', false);
  assert('$(html).find("x").hasClass("a")', false);
  assert('$(html).find("#b").hasClass("a")', false);
  assert('$(html).find("#b").hasClass("b")', true);
  assert('$(html).find("div, span").hasClass("a")', false);
  assert('$(html).find("div, span").hasClass("b")', true);
  assert('$(html).find("div, span").hasClass("c")', true);
  assert('$(html).find("div, span").hasClass("z")', false);

  assert('$(html).find("SPAN").size()', 2);
  assert('$(html).find("div, SPAN").size()', 3);

  assert('$(html).text()', 'XYZZ');
  assert('$(html).find("> *").text()', 'XYZZ');
  assert('$(html).find("z").text()', '');
  assert('$(html).find(".c").text()', 'XY');
  assert('$(html).find("*[d], *[e]").text()', 'XY');
  assert('$(html).find("div, span").text()', 'XYZZXYY');

  assert('$(html).size()', 1);
  assert('$(html).find("*").size()', 3);
  assert('$(html).find("div, span").size()', 3);
  assert('$(html).find("#a").size()', 0);
  assert('$(html).find(".b .c").size()', 1);
  assert('$(html).find(".b > .c").size()', 1);
  assert('$(html).find(".b > .c").size()', 1);

  assert('$(html).find("*").map(function() { return $(this).html() }).get()',
    [
      '<span class="c" d="e" e="ab- c de">X<span>Y</span></span>ZZ',
      'X<span>Y</span>',
      'Y'
    ]
  );

  assert('$(html).find("z").map(function() { return this; }).size()', 0);

  assert('$(html).html().length', 87);
  assert('$(html).find("div").html()', '<span class="c" d="e" e="ab- c de">X<span>Y</span></span>ZZ');
  assert('$(html).find(":not(div)").html()', 'X<span>Y</span>');
  assert('$(html).find("z").html()', undefined);

  assert('$(html).find("y, div, .b").find("span").size()', 2);

  assert('$(html).find("*[e*=\'b\']").size()', 1);
  assert('$(html).find("*[e^=\'a\']").size()', 1);
  assert('$(html).find("*[e$=\'e\']").size()', 1);
  assert('$(html).find("*[e~=\'c\']").size()', 1);
  assert('$(html).find("*[e|=\'ab\']").size()', 1);

  assert('$(html).find("*[e*=\'x\']").size()', 0);
  assert('$(html).find("*[e^=\'x\']").size()', 0);
  assert('$(html).find("*[e$=\'x\']").size()', 0);
  assert('$(html).find("*[e~=\'x\']").size()', 0);
  assert('$(html).find("*[e|=\'x\']").size()', 0);

  function assert(expression, expected) {
    describe(expression, function() {
      it ('returns ' + expected, function() {
        expectLibraryResult("JQUERY", $, expression, expected);
        expectLibraryResult("FRAG", fragQuery, expression, expected);
      });
    });
  }

  function expectLibraryResult(library, $, expression, expected) {
    var test = function() {
      return eval(expression);
    }
    try {
      result = test(html);
    }
    catch (e) {
      e.message = "Error evaluating " + expression + " in " + library + ": " + e.message;
      throw e;
    }
    expect(result).to.eql(expected, "unexpected " + library + " result");
  }
})
