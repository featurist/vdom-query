var daisyChain = require('./daisyChain');
var select = require("./vtree-select");

var attributeMap = {
  'class' : 'className',
  'for' : 'htmlFor'
};

function find(selector) {
  return v$(
    this.reduce(function(nodes, vtree) {
      return nodes.concat(select(selector)(vtree) || []);
    }, [])
  );
}

function is(selector) {
  return this.reduce(function(nodes, vtree) {
    return nodes.concat(select(selector)(vtree) || []);
  }, []).length > 0;
}

function hasClass(className) {
  return this.reduce(function(hasClass, node) {
    if (hasClass || !node.properties.className) { return hasClass }
    else {
      var classList = node.properties.className.split(' ');
      return classList.indexOf(className) !== -1;
    }
  }, false);
}

function attr(name) {
  if (this[0]) {
    var attributeKey = attributeMap[name] || name;
    return this[0].properties[attributeKey];
  }

}

function text() {
  return joinTextsIn(this);
}

function size() {
  return this.length;
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

function append(vdom){
  if (typeof vdom === 'string') {
    vdom = v$(vdom);
  }

  for (var i=0; i<this.length; i++) {
    var vnode = this[i];
    for (var j=0; j<vdom.length; j++) {
      var vdomItem = vdom[j];
      vnode.children.push(vdomItem);
    }
  }
  return this;
}

function parent() {
  return v$(this[0].parent);
}

function remove() {
  this.map(function(child){
    var parent = child.parent;

    var childIndex = parent.children.indexOf(child);
    parent.children.splice(childIndex, 1);

  });
}

function on(eventName, handler) {
  this.forEach(function(node) {
    var handlers = node.properties['on'+eventName] = node.properties['on'+eventName] || [];
    handlers.push(handler);
  });
  return this;
}

function trigger(eventName) {
  this.forEach(function(node){
    var events = (node.properties['on'+eventName] || []);
    if (!(events instanceof Array)) {
      events = [events];
    }
    events.forEach(function(handler){
      handler.bind(node)();
    });
    if (node.parent) {
      v$(node.parent).trigger(eventName);
    }
  });
}

function prop(name, value){
  if (value !== undefined) {
    this.forEach(function(node){
      delete node.properties[name];
      if (value) {
        node.properties[name] = name;
      }
    });
  } else {
    var node = this[0];
    if (name === 'tagName') {
      return node.tagName;
    }
    return node.properties && (node.properties[name] === name || node.properties[name] === '');
  }
}

function val() {
  if (v$(this).prop('tagName') === 'SELECT') {
    var selected = this[0].children.filter(function(node){
      return node.properties.selected === 'selected';
    })[0];
    return v$(selected).text();
  }
}

function htmlToDom(html){
  var parser = require('2vdom');
  var h = require('virtual-dom/h')
  return parser(function(tagName, properties){
    var fixedProperties = {};
    Object.keys(properties).forEach(function(key){
      var newKey = attributeMap[key] || key;
      fixedProperties[newKey] = properties[key];
    });
    var children = Array.prototype.slice.call(arguments, 2);
    return h(tagName, fixedProperties, children);
  }, html);
}

var vDaisy = daisyChain([find, append, parent, on, trigger], [text, size, hasClass, attr, is, remove, prop, val]);

function v$(vtree) {
  if (typeof vtree === 'string') {
    vtree = htmlToDom(vtree);
  }
  return vDaisy(vtree.hasOwnProperty('length') ? vtree : [vtree]);
}

module.exports = v$;
