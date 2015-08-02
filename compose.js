module.exports = function compose() {
  var funcs = arguments;
  return function composeWrapper() {
    var args = arguments;
    for (var i = funcs.length; i-- > 0; ) {
      args = [funcs[i].apply(this, args), ];
    }
    return args[0];
  };
};
