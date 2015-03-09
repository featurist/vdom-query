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

  children: function(selector) {
    if (typeof (selector) == 'string') {
      return this.find("> " + selector, function(p) { return p.toString() + '.children("' + selector + '")'; });
    }
    return this.find("> *", function(p) { return p.toString() + '.children()'; });
  },

  click: function(e) {
    var elements = this.get();
    for (var i = 0; i < elements.length; ++i) {
      if (elements[i].properties.onclick) {
        elements[i].properties.onclick(e);
      }
    }
  },

  each: function(callback) {
    var iterator = this.createIterator();
    while (iterator.hasNext()) {
      callback.call(null, iterator.next());
    }
  },

  elements: function() {
    return this.filter(function(n) {
      return typeof(n.text) !== 'string';
    });
  },

  find: function(selector, toString) {
    return this.mutate(createSelectIterator(this, selector, selectElements, toString));
  },

  hasClass: function(name) {
    return this.filter(function(e) {
      return e.properties && e.properties.className &&
               e.properties.className.split(' ').indexOf(name) > -1;
    }).size() > 0;
  },

  has: function(selector) {
    return this.filter(function(e) {
      return dollar([e]).find(selector).createIterator().hasNext();
    }, function(p) {
      return p + '.has("' + selector + '")';
    });
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

  is: function(selector) {
    if (typeof(selector) == 'string') {
      var iterator = this.createIterator();
      while (iterator.hasNext())
        if (select(selector).matches(iterator.next()))
          return true;
    }
    return false;
  },

  map: function(callback) {
    var self = this;
    return dollar(function() {
      return self.get().map(function(item) {
        return callback.apply(item);
      });
    })
  },

  not: function(selector) {
    var sel = select(selector);
    return this.filter(function(vdom) {
      return !sel.matches(vdom);
    }, function(p) {
      return p.toString() + '.not("' + selector + '")';
    });
  },

  outerHtml: function() {
    return stringify(this.get(0));
  },

  parent: function() {
    var elements = this.get();
    var all = this.startOfChain().find("*");
    return all.filter(function(e) {
      for (var i = 0; i < elements.length; i++) {
        if (e.children && e.children.indexOf(elements[i]) > -1)
          return true;
      }
      return false;
    });
  },

  size: function() {
    return this.get().length;
  },

  startOfChain: function() {
    var parent = this.createIterator();
    while (parent.parent) {
      parent = parent.parent;
    }
    return this.mutate(function() { return parent; });
  },

  text: function() {
    var texts = [];
    this.get().forEach(function(e) {
      var iterator = createSelectIterator(dollar([e]), '*', selectTextNodes)();
      while (iterator.hasNext()) {
        texts.push(iterator.next().text);
      }
    });
    return texts.join('');
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

function createSelectIterator(prev, selector, nodeFilter, toString) {
  return function() {
    var prevIterator = prev.createIterator();
    if (typeof(prevIterator.selector) == 'string') {
      prevIterator.selector = appendSelector(prevIterator.selector, selector);
      prevIterator.nodeFilter = nodeFilter;
      if (toString) {
        prevIterator.toString = function() {
          return toString(prev);
        };
      }
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
      parent: prevIterator,
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
        if (this.selector.indexOf(':root') == 0) {
          return 'V$("' + this.selector.replace(/:root\s*/, '') + '")';
        }
        return prev.toString() + '.find("' + this.selector + '")';
      }
    };
  };
};

function appendSelector(selector, addition) {
  return selector.split(/\s*,\s*/).map(function(pattern) {
    return pattern + ' ' + addition;
  }).join(', ');
}

module.exports = function(render) {
  return dollar(function() {
    return [render()];
  }).find(":root");
}
