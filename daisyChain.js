function daisyChain(transformers) {

  function Daisy(items, stalk) {
    this.stalk = stalk;
    for (var i = 0; i < (items || []).length; ++i) {
      this.push(items[i]);
    }
  }

  Daisy.prototype = [];

  Daisy.prototype.toArray = Daisy.prototype.toJSON = function() {
    return toArray(this);
  }

  function addTransformerToPrototype(func) {
    Daisy.prototype[func.name] = function() {
      return applyTransform.call(this, func, toArray(arguments));
    };
  }

  function applyTransform(func, args) {
    var transformed = func.apply(toArray(this), args);
    return new Daisy(transformed, this);
  }

  for (var i = 0; i < transformers.length; ++i) {
    addTransformerToPrototype(transformers[i]);
  }

  return function() {
    return new Daisy(arguments[0] || []);
  };
}

function toArray(a) {
  return [].slice.apply(a);
}

module.exports = daisyChain;
