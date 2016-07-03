var cssSelect = require('css-select');

function VDomQuery(nodes, selector) {
  if (nodes && nodes.length) {
    var selected = selector ? cssSelect(selector, nodes) : nodes;
    copyArray(selected, this);
    this.length = selected.length;
  }
}

VDomQuery.prototype.length = 0;

VDomQuery.prototype.attr = function(name) {
  return this.length > 0 ? this[0].attribs[name] : undefined;
}

VDomQuery.prototype.children = function(selector) {
  var children = childrenOf(this);
  if (typeof(selector) == 'string') {
    children = filter(children, function(child) {
      return cssSelect.is(child, selector);
    });
  }
  return new VDomQuery(children);
}

VDomQuery.prototype.eq = function(index) {
  return this.slice(0, 1);
}

VDomQuery.prototype.filter = function(predicate) {
  return filter(this, predicate);
}

VDomQuery.prototype.find = function(selector) {
  return new VDomQuery(childrenOf(this), selector);
}

VDomQuery.prototype.first = function(selector) {
  return this.eq(0);
}

VDomQuery.prototype.has = function(selector) {
  return new VDomQuery(this.filter(function(element) {
    return !!cssSelect.selectOne(selector, element.children);
  }));
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
    return index >= 0 && index < this.length ? this[index] : undefined;
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
  return new VDomQuery(pluckTruthy(this, 'next'), selector);
}

VDomQuery.prototype.not = function(selector) {
  return new VDomQuery(this.filter(function(el) {
    return !cssSelect.is(el, selector);
  }));
}

VDomQuery.prototype.prev = function(selector) {
  return new VDomQuery(pluckTruthy(this, 'prev'), selector);
}

VDomQuery.prototype.slice = function(start, end) {
  var sliced = [];
  for (var i = start; (!end || i < end) && i < this.length; ++i) {
    sliced.push(this[i]);
  }
  return new VDomQuery(sliced);
}

function filter(array, predicate) {
  var results = [];
  for (var i = 0; i < array.length; ++i) {
    if (predicate(array[i])) {
      results.push(array[i]);
    }
  }
  return results;
}

function copyArray(from, to) {
  for (var i = 0; i < from.length; i++) {
    to[i] = from[i];
  }
}

function pluckTruthy(array, property) {
  var plucked = [];
  for (var i = 0; i < array.length; ++i) {
    var v = array[i][property];
    if (v) { plucked.push(v); }
  }
  return plucked;
}

function childrenOf(node) {
  var results = [];
  for (var i = 0; i < node.length; ++i) {
    results = results.concat(node[i].children || []);
  }
  return results;
}

function convertVNode(vnode, parent) {
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
