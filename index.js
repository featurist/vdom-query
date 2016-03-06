var daisyChain = require('./daisyChain');
var select = require("vtree-select");
var parser = require('html2hscript');

function find(selector) {
  return v$(
    this.reduce(function(nodes, vtree) {
      return nodes.concat(select(selector)(vtree));
    }, [])
  );
}

function text() {
  return joinTextsIn(this);
}

function size() {
  return this.reduce(function(count, node){
    return count + node.children.length;
  }, 0);
}

function joinTextsIn(vnodes) {
  return vnodes.reduce(function(texts, node) {
    if (typeof(node.text) == 'string') {
      var text = node.text.trim();
      if (text.length > 0) { texts.push(text); }
    }
    else if (node.children) {
      texts = texts.concat(joinTextsIn(node.children));
    }
    return texts;
  }, []).join(' ');
}

function append(vdom){
  if (typeof vdom === 'string') {
    vdom = v$(vdom);
  }

  for (var i=0; i<this.length; i++) {
    var vnode = this[i];
    for (var j=0; j<vdom.length; j++) {
      var vdomItem = vdom[j];
      vnode.children.push(vdomItem);
    }
  }
  return this;
}

function htmlToDom(html){
  var VNode = require('virtual-dom/vnode/vnode');
  var VText = require('virtual-dom/vnode/vtext');

  var convertHTML = require('html-to-vdom')({
    VNode: VNode,
    VText: VText
  });

  return convertHTML(html);
}

var vDaisy = daisyChain([find, append], [text, size]);

function v$(vtree) {
  if (typeof vtree === 'string') {
    vtree = htmlToDom(vtree);
  }
  return vDaisy(vtree.length > 0 ? vtree : [vtree]);
}

module.exports = v$;
