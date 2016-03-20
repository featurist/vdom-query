"use strict";

// @TODO text content

var language = require("cssauron")({
  tag: "tagName",
  children: "children",
  parent: "parent",
  contents: "contents",
  attr: function(node, attr) {
    if (node.properties) {
      return node.properties[attr];
    }
  },
  class: function(node) {
    return node.properties.className;
  },
  id: function(node) {
    return node.properties.id;
  },
}, function(type, pattern, data) {
  if (type == 'tag') {
    return pattern && pattern.toLowerCase() == data.toLowerCase();
  } else {
    return pattern === data;
  }
});

module.exports = function(sel) {
  var selector = language(sel);
  function match(vtree) {
    var node = mapTree(vtree);
    var matched = [];

    // Traverse each node in the tree and see if it matches our selector
    traverse(node, function(node) {
      var result = selector(node);
      if (result) {
        if ( ! Array.isArray(result)) {
          result = [result];
        }
        matched.push.apply(matched, result);
      }
    });

    if ( ! matched.length) {
      return null;
    }
    return matched;
  };
  match.matches = function(vtree) {
    return !!selector(vtree);
  }
  return match;
};

function traverse(vtree, fn) {
  fn(vtree);
  if (vtree.children) {
    vtree.children.forEach(function(vtree) {
      traverse(vtree, fn);
    });
  }
}


function mapTree(vtree, parent) {
  if (vtree.type === "VirtualText") {
    vtree.contents = vtree.text;
    vtree.parent = parent;
    vtree.properties = {};
    return vtree;
  }

  vtree.parent = parent;
  vtree.properties = vtree.properties || {};
  vtree.contents = "";
  vtree.children.forEach(function(child) {
    return mapTree(child, vtree);
  });
  return vtree;
}
