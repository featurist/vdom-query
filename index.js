var stringify = require('virtual-dom-stringify');
var select = require('vtree-select');

function Frag(render, selector, predicate) {
  this.render = render;
  this.selector = selector;
  this.predicate = predicate;
  return this;
}

Frag.prototype.nodes = function() {
  var vdom = this.render();
  var nodes;
  if (this.selector == '> *') {
    nodes = [vdom];
  } else {
    nodes = select(this.selector)(vdom) || [];
  }
  return nodes;
}

Frag.prototype.filterNodes = function(nodes) {
  if (this.predicate) {
    var filtered = [];
    for (var i = 0; i < nodes.length; ++i) {
      if (this.predicate(nodes[i], i)) {
        filtered.push(nodes[i]);
      }
    }
    return filtered;
  }
  else {
    return nodes;
  }
}

Frag.prototype.elements = function() {
  return this.filterNodes(nodesWithTagNames(this.nodes()));
}

Frag.prototype.textNodes = function() {
  return nodesWithText(this.nodes());
}

Frag.prototype.get = function() {
  return this.elements();
}

Frag.prototype.eq = function(n) {
  return new Frag(this.render, this.selector, function(item, i) {
    return i == n;
  });
}

Frag.prototype.html = function() {
  var elements = this.elements();
  if (elements.length > 0) {
    return elements[0].children.map(function(node) {
      return stringify(node);
    }).join('');
  } else {
    return undefined;
  }
}

Frag.prototype.text = function() {
  var textNodes = this.textNodes();
  if (textNodes.length == 0) {
    textNodes = this.find("*").textNodes();
  }
  return textNodes.map(function(e) {
    return e.text;
  }).join('');
}

Frag.prototype.find = function(selector) {
  return new Frag(this.render, this.selector.split(',').map(function(t) {
    return t.trim() + ' ' + selector;
  }).join(', '));
}

Frag.prototype.attr = function(name) {
  var elements = this.elements();
  if (elements.length > 0) {
    var el = elements[0];
    if (name == 'class') {
      return el.properties.className;
    }
    return el.properties[name];
  } else {
    return undefined;
  }
}

Frag.prototype.size = function(name) {
  return this.elements().length;
}

Frag.prototype.hasClass = function(name) {
  return this.elements().filter(function(e) {
    return e.properties && e.properties.className &&
             e.properties.className.split(' ').indexOf(name) > -1;
  }).length > 0;
}

Frag.prototype.toString = function() {
  return 'frag(' + this.html() + ')';
}

Frag.prototype.click = function(e) {
  var elements = this.elements();
  for (var i = 0; i < elements.length; ++i) {
    if (elements[i].properties.onclick) {
      elements[i].properties.onclick(e);
    }
  }
}

function nodesWithTagNames(nodes) {
  return nodes.filter(function(n) {
    return typeof(n.tagName) === 'string';
  })
}

function nodesWithText(nodes) {
  return nodes.filter(function(n) {
    return typeof(n.text) === 'string';
  })
}

module.exports = function(render) {
  return new Frag(render, '> *');
}
