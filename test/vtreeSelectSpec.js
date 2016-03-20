"use strict";

var h = require("virtual-hyperscript");
var select = require("../vtree-select");

var span1 = h("span.span1", "hello world");
var span2 = h("span.span2", "hello world2");
var li = h("LI", "item");
var ul = h("ul", [li]);
var tree = h("DIV#tree", [span1, span2, ul]);

var assert = require("assert");
describe('vtree-select', function(){
  it('selects the parent', function(){
    var li = select('li')(tree)[0];
    assert.strictEqual(li.parent.children.indexOf(li), 0);
  });

  it('select root element', function(){
    assert.deepEqual(select("div")(tree), [tree]);
    assert.deepEqual(select("div")(tree), [tree]);
    assert.deepEqual(select("#tree")(tree), [tree]);
    assert.deepEqual(select("[id]")(tree), [tree]);
    assert.deepEqual(select("[id=tree]")(tree), [tree]);
    assert.deepEqual(select("div[id=tree]")(tree), [tree]);
  });

  it('select children', function(){
    assert.deepEqual(select("span")(tree), [span1, span2]);
    assert.deepEqual(select("span.span1")(tree), [span1]);
    assert.deepEqual(select("span.span2")(tree), [span2]);
    // 3rd tier children
    assert.deepEqual(select("div ul LI")(tree), [li]);
  });


  it('uses css operator', function(){
    assert.deepEqual(select("div ul > li")(tree), [li]);
    assert.deepEqual(select("div * > li")(tree), [li]);
    assert.deepEqual(select("*:root")(tree), [tree]);

    assert.deepEqual(select("!* > :contains('hello')")(tree), [span1, span2]);
  });


  it('matches(vtree)', function(){
    assert.strictEqual(select("*:root#tree").matches(tree), true);
    assert.strictEqual(select("span.span1").matches(tree.children[0]), true);
    assert.strictEqual(select("zz").matches(tree), false);
    assert.strictEqual(select(":not(span)").matches(tree), true);
    assert.strictEqual(select(":not(div)").matches(tree), false);
  });
})
