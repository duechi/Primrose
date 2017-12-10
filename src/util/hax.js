/*
pliny.function({
  parent: "Util",
  name: "hax",
  description: "Replace a function stored in an object with a different function that intercepts it and the arguments passed to it. This is generally a very useful way for getting in between the browser's APIs and any 3rd party libraries that do fancy things with those APIs."
});
*/
export default function hax(target, name, thunk) {
  var original = target[name];
  if(original) {
    target[name] = function() {
      var args = Array.prototype.slice.call(arguments);
      return thunk(original, args);
    }
  }
};
