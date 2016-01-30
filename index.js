var daisyChain = require('./daisyChain');
var select = require("vtree-select");

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

var vDaisy = daisyChain([find], [text]);

function v$(vtree) {
  return vDaisy(vtree.length > 0 ? vtree : [vtree]);
}

module.exports = v$;
