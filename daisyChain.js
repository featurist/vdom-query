function functionName(fun) {
  var ret = fun.toString();
  ret = ret.substr('function '.length);
  ret = ret.substr(0, ret.indexOf('('));
  return ret;
}

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
    return [].slice.apply(this);
  }

  function addChainableToPrototype(func) {
    Daisy.prototype[functionName(func)] = function() {
      return applyTransform.call(this, func, arguments);
    };
  }

  function addChainBreakerToPrototype(func) {
    Daisy.prototype[functionName(func)] = function() {
      return func.apply(this, arguments);
    };
  }

  function applyTransform(func, args) {
    var transformed = func.apply(this, args);
    return new Daisy(transformed, this);
  }

  for (var i = 0; i < chainables.length; ++i) {
    addChainableToPrototype(chainables[i]);
  }

  for (var i = 0; i < chainBreakers.length; ++i) {
    addChainBreakerToPrototype(chainBreakers[i]);
  }

  var fn = function() {
    var d = new Daisy(arguments[0] || []);
    return d
  };

  fn.fn = {
    extend: function (object) {
      Object.keys(object).forEach(function (name) {
        var func = object[name]
        Daisy.prototype[name] = function() {
          return func.apply(this, arguments);
        };
      })
    }
  }

  return fn
}

module.exports = daisyChain;
