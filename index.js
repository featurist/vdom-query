var cssSelect = require('css-select');

function VDomQuery(nodes, selector) {
  var selected = selector ? cssSelect(selector, nodes) : nodes;
  copyArray(selected, this);
  this.length = selected.length;
}

VDomQuery.prototype.attr = function(name) {
  return this.length > 0 ? this[0].attribs[name] : undefined;
}

VDomQuery.prototype.children = function(selector) {
  var children = childrenOf(this);
  if (typeof(selector) == 'string') {
    children = children.filter(function(child) {
      return cssSelect.is(child, selector);
    });
  }
  return new VDomQuery(children);
}

VDomQuery.prototype.eq = function(index) {
  var element = this.get(index);
  return new VDomQuery(element ? [element] : []);
}

VDomQuery.prototype.filter = function(predicate) {
  var results = [];
  for (var i = 0; i < this.length; ++i) {
    if (predicate(this[i])) {
      results.push(this[i]);
    }
  }
  return results;
}

VDomQuery.prototype.find = function(selector) {
  return new VDomQuery(childrenOf(this), selector);
}

VDomQuery.prototype.first = function(selector) {
  return this.eq(0);
}

VDomQuery.prototype.has = function(selector) {
  var filtered = [];
  for (var i = 0; i < this.length; ++i) {
    if (cssSelect.selectOne(selector, this[i].children)) {
      filtered.push(this[i]);
    }
  }
  return new VDomQuery(filtered);
}

VDomQuery.prototype.is = function(selector) {
  for (var i = 0; i < this.length; ++i) {
    if (cssSelect.is(this[i], selector)) {
      return true;
    }
  }
  return false;
}

VDomQuery.prototype.get = function(index) {
  if (typeof(index) == 'undefined') {
    var array = [];
    copyArray(this, array);
    return array;
  } else {
    return index >= 0 && index < this.length ? [this[index]] : undefined;
  }
}

VDomQuery.prototype.map = function(fn) {
  var results = [];
  for (var i = 0; i < this.length; ++i) {
    results.push(fn(this[i]));
  }
  return results;
}

VDomQuery.prototype.next = function(selector) {
  var nexts = [];
  for (var i = 0; i < this.length; ++i) {
    if (this[i].next) {
      nexts.push(this[i].next);
    }
  }
  return new VDomQuery(nexts, selector);
}

VDomQuery.prototype.not = function(selector) {
  return new VDomQuery(this.filter(function(el) {
    return !cssSelect.is(el, selector);
  }));
}

VDomQuery.prototype.prev = function(selector) {
  var nexts = [];
  for (var i = 0; i < this.length; ++i) {
    if (this[i].prev) {
      nexts.push(this[i].prev);
    }
  }
  return new VDomQuery(nexts, selector);
}

function copyArray(from, to) {
  for (var i = 0; i < from.length; i++) {
    to[i] = from[i];
  }
}

function childrenOf(node) {
  var results = [];
  for (var i = 0; i < node.length; ++i) {
    results = results.concat(node[i].children || []);
  }
  return results;
}

function convertVNode(vnode, parent) {
  // console.log(vdom, null, false);
  var node = {};
  if ('text' in vnode) {
    node.type = 'text';
    node.data = vnode.text;
  }
  else {
    node.type = 'tag';
  }
  node.attribs = {};
  if (vnode.properties) {
    for (var key in vnode.properties.attributes) {
      node.attribs[key] = vnode.properties.attributes[key];
    }
    for (var key in vnode.properties) {
      if (key != 'attributes') {
        node.attribs[key] = vnode.properties[key];
      }
    }
  }

  if ('tagName' in vnode) {
    node.name = vnode.tagName.toLowerCase();
  }
  if ('children' in vnode) {
    node.children = vnode.children.map(function convertChild(child) {
      return convertVNode(child, node);
    });
    for (var i = 0; i < node.children.length; i++) {
      node.children[i].prev = node.children[i - 1] || null;
      node.children[i].next = node.children[i + 1] || null;
    }
  } else {
    node.children = [];
  }
  node.parent = parent;
  node.next = null;
  node.prev = null;
  return node;
}

function createVDomQuery(vwindow) {
  return function vDomQuery(selector) {
    return new VDomQuery([convertVNode(vwindow.document)], selector);
  };
}

module.exports = createVDomQuery;
