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

  children: function() {
    return this.find("> *");
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
    return this.mutate(createSelectIterator(this, selector, selectElements));
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

  is: function(selector) {
    var iterator = this.createIterator();
    while (iterator.hasNext())
      if (select(selector).matches(iterator.next()))
        return true;

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
    });
  },

  size: function() {
    return this.get().length;
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

function createSelectIterator(prev, selector, nodeFilter) {
  return function() {
    var prevIterator = prev.createIterator();
    if (typeof(prevIterator.selector) == 'string') {
      prevIterator.selector = appendSelector(prevIterator.selector, selector);
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
