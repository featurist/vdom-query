var cssSelect = require('css-select');
var vdomToHtml = require('vdom-to-html');

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
  return new VDomQuery(typeof(selector) == 'string' ?
    filter(childrenOf(this), function(child) {
      return cssSelect.is(child, selector);
    }) : childrenOf(this));
}

VDomQuery.prototype.click = function() {
  this.each(function(element) {
    var vnode = element.vnode;
    if (vnode.properties.onclick) {
      vnode.properties.onclick({ target: vnode });
    }
  });
}

VDomQuery.prototype.each = function(fn) {
  for (var i = 0; i < this.length; ++i) {
    fn(this[i]);
  }
}

VDomQuery.prototype.eq = function(index) {
  return this.slice(index, index + 1);
}

VDomQuery.prototype.filter = function(predicate) {
  return filter(this, predicate);
}

VDomQuery.prototype.find = function(selector) {
  return new VDomQuery(childrenOf(this), selector);
}

VDomQuery.prototype.first = function() {
  return this.eq(0);
}

VDomQuery.prototype.has = function(selector) {
  return new VDomQuery(this.filter(function(element) {
    return !!cssSelect.selectOne(selector, element.children);
  }));
}

VDomQuery.prototype.hasClass = function(className) {
  return this.is('.' + className);
}

VDomQuery.prototype.html = function() {
  return this.length ? childrenOf([this[0]]).map(function(e) {
    return vdomToHtml(e.vnode)
  }).join('') : undefined;
};

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

VDomQuery.prototype.last = function() {
  return this.eq(this.length - 1);
}

VDomQuery.prototype.map = function(fn) {
  var results = [];
  for (var i = 0; i < this.length; ++i) {
    results.push(fn.apply(this[i], [i]));
  }
  return new VDomQuery(results);
}

VDomQuery.prototype.next = function(selector) {
  return pluckSelect(this, 'next', selector);
}

VDomQuery.prototype.nextAll = function(selector) {
  return pluckSelectAll(this, 'next', selector);
}

VDomQuery.prototype.not = function(selector) {
  return new VDomQuery(this.filter(function(el) {
    return !cssSelect.is(el, selector);
  }));
}

VDomQuery.prototype.parent = function(selector) {
  return pluckSelect(this, 'parent', selector);
}

VDomQuery.prototype.parents = function(selector) {
  return pluckSelectAll(this, 'parent', selector);
}

VDomQuery.prototype.prev = function(selector) {
  return pluckSelect(this, 'prev', selector);
}

VDomQuery.prototype.prevAll = function(selector) {
  return pluckSelectAll(this, 'prev', selector);
}

VDomQuery.prototype.siblings = function(selector) {
  return new VDomQuery(this.prevAll(selector).get().concat(this.nextAll(selector).get()));
}

VDomQuery.prototype.slice = function(start, end) {
  if (start < 0) return new VDomQuery([]);
  var sliced = new VDomQuery();
  for (var i = start; (!end || i < end) && i < this.length; ++i) {
    sliced[sliced.length++] = this[i];
  }
  return sliced;
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

function pluckSelect(array, property, selector) {
  var plucked = new VDomQuery();
  for (var i = 0; i < array.length; ++i) {
    var v = array[i][property];
    if (v && v.type == 'tag' && (!selector || cssSelect.is(v, selector))) {
      plucked[plucked.length++] = v;
    }
  }
  return plucked;
}

function pluckSelectAll(array, property, selector) {
  return new VDomQuery(pluckSelectNext(array, property, selector))
}

function pluckSelectNext(array, property, selector) {
  var plucked = [];
  for (var i = 0; i < array.length; ++i) {
    var v = array[i][property];
    if (v && v.type == 'tag') {
      plucked = plucked.concat([v]).concat(pluckSelectNext([v], property, selector));
    }
  }
  return selector ? filter(plucked, function(e) { return cssSelect.is(e, selector) } ) : plucked;
}

function childrenOf(node) {
  var results = [];
  for (var i = 0; i < node.length; ++i) {
    results = results.concat(node[i].children || []);
  }
  return results;
}

function convertVNode(vnode, parent) {
  var node = {
    parent: parent,
    next: null,
    prev: null,
    attribs: {},
    vnode: vnode
  };
  if ('text' in vnode) {
    node.type = 'text';
    node.data = vnode.text;
  }
  else {
    node.type = 'tag';
  }
  if (vnode.properties) {
    for (var key in vnode.properties.attributes) {
      node.attribs[key] = vnode.properties.attributes[key];
    }
    for (var key in vnode.properties) {
      if (key != 'attributes') {
        if (key == 'className') {
          node.attribs.class = vnode.properties[key];
        } else {
          node.attribs[key] = vnode.properties[key];
        }
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
  return node;
}

function createVDomQuery(vdom) {
  var dom = convertVNode(vdom);
  return function vDomQuery(selector) {
    if (typeof(selector) == 'string') {
      return new VDomQuery([dom], selector);
    } else if (typeof(selector.get) == 'function') {
      return selector;
    } else if (typeof(selector.length) == 'number') {
      return new VDomQuery(selector);
    } else {
      return new VDomQuery([selector]);
    }
  };
}

module.exports = createVDomQuery;
