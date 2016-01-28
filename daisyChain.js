function daisyChain(chainables, chainBreakers) {
  chainBreakers = chainBreakers || [];

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

  function addChainableToPrototype(func) {
    Daisy.prototype[func.name] = function() {
      return applyTransform.call(this, func, toArray(arguments));
    };
  }

  function addChainBreakerToPrototype(func) {
    Daisy.prototype[func.name] = function() {
      return func.call(toArray(this), arguments);
    };
  }

  function applyTransform(func, args) {
    var transformed = func.apply(toArray(this), args);
    return new Daisy(transformed, this);
  }

  for (var i = 0; i < chainables.length; ++i) {
    addChainableToPrototype(chainables[i]);
  }

  for (var i = 0; i < chainBreakers.length; ++i) {
    addChainBreakerToPrototype(chainBreakers[i]);
  }

  return function() {
    return new Daisy(arguments[0] || []);
  };
}

function toArray(a) {
  return [].slice.apply(a);
}

module.exports = daisyChain;
