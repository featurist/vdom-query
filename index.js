var daisyChain = require('./daisyChain');
var select = require("./vtree-select");

var attributeMap = {
  'class' : 'className',
  'for' : 'htmlFor'
};

function shallowClone(obj){
  var cloned = {};
  Object.keys(obj).forEach(function(key){
    cloned[key] = obj[key];
  });
  return cloned;
}

function find(selector) {
  return v$(
    this.reduce(function(nodes, vtree) {
      return nodes.concat(select(selector)(vtree) || []);
    }, [])
  );
}

function is(selector) {
  return this.reduce(function(nodes, vtree) {
    var vtreeWithoutChildren = {
      parent: vtree.parent,
      properties: vtree.properties,
      contents: vtree.contents,
      children: []
    };
    return nodes.concat(select(selector)(vtreeWithoutChildren) || []);
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

function addClass(className) {
  this.forEach(function(node) {
    if (!v$(node).hasClass(className)) {
      node.properties = node.properties || {};
      node.properties.className = node.properties.className || '';
      node.properties.className += ' ' + className;
    }
  });
  return this;
}

function attr(name) {
  if (this[0]) {
    var attributeKey = attributeMap[name] || name;
    return this[0].properties[attributeKey];
  }
}
function innerText(){
  return joinTextsIn(this, true);
}

function text(text) {
  if (text) {
    this.forEach(function(node){
      node.text = text;
    });
  }
  return joinTextsIn(this);
}

function size() {
  return this.length;
}

function joinTextsIn(vnodes, includeLineBreaks) {
  return vnodes.reduce(function(texts, node) {
    if (includeLineBreaks && node.tagName === 'BR') {
      var position = texts.length-1;
      texts[position] = texts[position] + '\n';
    }
    else if (typeof(node.text) === 'string') {
      var text = node.text.trim();
      if (text.length > 0) { texts.push(text); }
    }
    else if (node.children) {
      texts = texts.concat(joinTextsIn(node.children, includeLineBreaks));
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
    node.properties = node.properties || {};
    var handlers = node.properties['on'+eventName] = node.properties['on'+eventName] || [];
    handlers.push(handler);
  });
  return this;
}

function noop(){}

function trigger(eventName, data) {
  data = data || {};

  this.forEach(function(node){
    data = shallowClone(data);
    data.preventDefault = noop; // there is nothing to prevent anyway, it is all virtual!

    data.currentTarget = data.currentTarget || node;
    data.target = data.target || node;
    data.eventPhase = data.eventPhase || 2;

    if (data.eventPhase === 2 && eventName === 'click') {
      if (node.tagName === 'INPUT' && (node.properties.type === 'checkbox' || node.properties.type === 'radio')) {
        var $node = v$(node);
        $node.prop('checked', !$node.prop('checked'));
      }

      if (node.tagName === 'LABEL') {
        v$(node).find('input[type=checkbox],input[type=radio]').trigger('click', data);
      }

      if (node.tagName === 'BUTTON' && (node.properties.type || '').toLowerCase() === 'submit') {
        v$(node).trigger('submit');
      }
    }
    node.properties = node.properties || {};
    var events = (node.properties['on'+eventName] || []);
    if (!(events instanceof Array)) {
      events = [events];
    }
    events.forEach(function(handler){
      handler.bind(node)(data);
    });
    if (node.parent) {
      var parentData = shallowClone(data)
      parentData.eventPhase = 3;
      parentData.currentTarget = node.parent;
      v$(node.parent).trigger(eventName, parentData);
    }
  });
}

function focus() {
  return v$(this[0]).trigger('focus');
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

function val(setValue) {
  var el = v$(this);
  if (el.prop('tagName') === 'SELECT') {
    if (setValue !== undefined) {
      this[0].value = setValue;
    }
    var selected = this[0].children.filter(function(node){
      return node.properties.selected === 'selected';
    })[0];

    if (selected) {
      return v$(selected).val();
    }
  }

  if (el.prop('tagName') === 'OPTION') {
    return el[0].properties.value || el.text();
  }

  if (el.prop('tagName') === 'INPUT') {
    if (setValue !== undefined) {
      this[0].properties.value = setValue;
      this[0].value = setValue;
    }
    var value = this[0].properties.value;
    if (value && value.value) {
      return value.value;
    }
    return value;
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

var vDaisy = daisyChain([find, append, parent, on, trigger, focus, addClass], [innerText, text, size, hasClass, attr, is, remove, prop, val]);

function v$(vtree) {
  if (typeof vtree === 'string') {
    vtree = htmlToDom(vtree);
  }
  if (!vtree) {
    vtree = [];
  }
  return vDaisy(vtree.hasOwnProperty('length') ? vtree : [vtree]);
}

module.exports = v$;
