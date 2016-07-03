var cssSelect = require('css-select');

function VDomQuery(domNodes, selector) {
  var filtered = selector ? cssSelect(selector, domNodes) : domNodes;
  for (var i = 0; i < filtered.length; i++) {
    this[i] = filtered[i];
  }
  this.length = filtered.length;
}

VDomQuery.prototype.attr = function(name) {
  return this.length > 0 ? this[0].attribs[name] : undefined;
}

VDomQuery.prototype.children = function(selector) {
  var children = this.get().reduce(function(m, e) {
    return m.concat(e.children);
  }, []);
  if (selector) {
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
  var children = this.get().reduce(function(m, e) {
    return m.concat(e.children);
  }, []);
  return new VDomQuery(children, selector);
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
    for (var i = 0; i < this.length; i++) { array.push(this[i]); }
    return array;
  } else {
    return index > -1 && index < this.length ? [this[index]] : undefined;
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
  var nexts = this.map(function(el) {
    return el.next;
  }).filter(function(el) {
    return !!el;
  });
  return new VDomQuery(nexts, selector);
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
