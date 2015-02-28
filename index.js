var vdollar = require('vdollar');
var stringify = require('virtual-dom-stringify');
var select = require('vtree-select');

var dollar = vdollar.extend({
  attr: function(name) {
    var elements = this.get();
    if (elements.length > 0) {
      var el = elements[0];
      if (name == 'class') {
        return el.properties.className;
      }
      return el.properties[name];
    } else {
      return undefined;
    }
  },

  click: function(e) {
    var elements = this.get();
    for (var i = 0; i < elements.length; ++i) {
      if (elements[i].properties.onclick) {
        elements[i].properties.onclick(e);
      }
    }
  },

  elements: function() {
    return this.filter(function(n) {
      return typeof(n.text) !== 'string';
    });
  },

  find: function(selector) {
    return this.mutate(createSelectorIterator(this, selector, selectElements));
  },

  hasClass: function(name) {
    return this.filter(function(e) {
      return e.properties && e.properties.className &&
               e.properties.className.split(' ').indexOf(name) > -1;
    }).size() > 0;
  },

  html: function() {
    var elements = this.get();
    if (elements.length > 0) {
      return elements[0].children.map(function(node) {
        return stringify(node);
      }).join('');
    } else {
      return undefined;
    }
  },

  size: function() {
    return this.get().length;
  },

  text: function() {
    var iterator = createSelectorIterator(this, '*', selectTextNodes);
    return this.mutate(iterator).get().map(function(n) {
      return n.text;
    }).join('');
  },

  textNodes: function() {
    return this.filter(function(n) {
      return typeof(n.text) === 'string';
    })
  },

  toString: function() {
    return "vdom-dollar";
  }
});

function selectElements(vdom, selector) {
  return nodesWithTagNames((select(selector))(vdom) || []);
}

function selectTextNodes(vdom, selector) {
  return nodesWithText((select(selector))(vdom) || []);
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

function createSelectorIterator(prev, selector, nodeFilter) {
  return function() {
    var prevIterator = prev.createIterator();
    if (typeof(prevIterator.selector) == 'string') {
      if (prevIterator.selector == ':root' && selector[0] == '>') {
        prevIterator.selector = selector;
      } else {
        prevIterator.selector += ' ' + selector;
      }
      prevIterator.nodeFilter = nodeFilter;
      return prevIterator;
    }

    var iterator;
    function ensureSelected(i) {
      if (!iterator) {
        vdom = prevIterator.next();
        if (vdom) {
          var selectedElements = i.nodeFilter(vdom, i.selector);
          iterator = vdollar(selectedElements).createIterator();
        }
        else
          iterator = vdollar([]).createIterator();

        iterator.selector = selector;
      }
    }
    return {
      op: "selector",
      selector: selector,
      nodeFilter: nodeFilter,
      next: function() {
        ensureSelected(this);
        return iterator.next();
      },
      hasNext: function() {
        ensureSelected(this);
        return iterator.hasNext();
      },
      toString: function() {
        return selector;
      }
    };
  };
};

module.exports = function(render) {
  return dollar(function() {
    return [render()];
  }).find(":root");
}
