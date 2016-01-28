var daisyChain = require('./daisyChain');
var select = require("vtree-select");


module.exports = function(root){
  function find(selector){
    return select(selector)(root);
  }

  function text(){
    function getChildText(node){
      var text = node.text || '';
      (node.children || []).forEach(function(childNode){
        text += getChildText(childNode);
      });
        
      return text;
    }

    return this.reduce(function(textBuffer, node){
      return textBuffer + getChildText(node);
    }, '');
  }

  function isVdomQueryObject(){
    return (root.find && root.text);
  }
  var $ = daisyChain([find], [text]);
  if (isVdomQueryObject()){
    return root;
  }
  return $([root]);
};
