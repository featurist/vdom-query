var stringify = require('virtual-dom-stringify');
var select = require('vtree-select');

function Frag(render, selector) {
  this.render = render;
  this.selector = selector;
  return this;
}

Frag.prototype.nodes = function() {
  var vdom = this.render();
  if (this.selector) {
    return select(this.selector)(vdom) || [];
  }
  else {
    return [vdom];
  }
}

Frag.prototype.elements = function() {
  return nodesWithTagNames(this.nodes());
}

Frag.prototype.textNodes = function() {
  return nodesWithText(this.nodes());
}

Frag.prototype.html = function() {
  var elements = this.elements();
  if (elements.length > 0) {
    return elements[0].children.map(function(node) {
      return stringify(node);
    }).join('');
  } else {
    return '';
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
  if (this.selector) {
    return new Frag(this.render, this.selector.split(',').map(function(t) {
      return t.trim() + ' ' + selector;
    }).join(', '));
  }
  else {
    return new Frag(this.render, selector);
  }
}

Frag.prototype.attr = function(name) {
  var elements = this.elements();
  if (elements.length > 0) {
    return elements[0].properties[name];
  } else {
    return undefined;
  }
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
  return new Frag(render);
}
