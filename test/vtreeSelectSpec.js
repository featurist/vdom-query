"use strict";

var h = require("virtual-hyperscript");
var select = require("../vtree-select");

var span1 = h("span.span1", "hello world");
var span2 = h("span.span2", "hello world2");
var li = h("LI", "item");
var ul = h("ul", [li]);
var tree = h("DIV#tree", [span1, span2, ul]);

function vtree(nodes){
  return nodes.map(function(node){
    return node.vtree;
  });
}

function vtreeEqual(actual, expected){
  assert.deepEqual(vtree(actual), expected);
}

var assert = require("assert");
describe('vtree-select', function(){
  it('selects the parent', function(){
    var li = select('li')(tree)[0];
    assert.strictEqual(li.parent.children.indexOf(li), 0);
  });

  it('select root element', function(){
    vtreeEqual(select("div")(tree), [tree]);
    vtreeEqual(select("div")(tree), [tree]);
    vtreeEqual(select("#tree")(tree), [tree]);
    vtreeEqual(select("[id]")(tree), [tree]);
    vtreeEqual(select("[id=tree]")(tree), [tree]);
    vtreeEqual(select("div[id=tree]")(tree), [tree]);
  });

  it('select children', function(){
    vtreeEqual(select("span")(tree), [span1, span2]);
    vtreeEqual(select("span.span1")(tree), [span1]);
    vtreeEqual(select("span.span2")(tree), [span2]);
    // 3rd tier children
    vtreeEqual(select("div ul LI")(tree), [li]);
  });


  it('uses css operator', function(){
    vtreeEqual(select("div ul > li")(tree), [li]);
    vtreeEqual(select("div * > li")(tree), [li]);
    vtreeEqual(select("*:root")(tree), [tree]);

    vtreeEqual(select("!* > :contains('hello')")(tree), [span1, span2]);
  });


  it('matches(vtree)', function(){
    assert.strictEqual(select("*:root#tree").matches(tree), true);
    assert.strictEqual(select("span.span1").matches(tree.children[0]), true);
    assert.strictEqual(select("zz").matches(tree), false);
    assert.strictEqual(select(":not(span)").matches(tree), true);
    assert.strictEqual(select(":not(div)").matches(tree), false);
  });
})
