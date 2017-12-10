import hax from "./hax";

/*
pliny.function({
  parent: "Util",
  name: "haxClass",
  description: "Intercept a class (a function that can be invoked with `new`) that is stored in a target object and inject our own code to run before the object is instantiated.",
  parameters: [{
    name: "target",
    type: "Object",
    description: "The object in which the class is stored. Probably `window`."
  }, {
    name: "name",
    type: "String",
    description: "The name of the class, in the object store."
  }, {
    name: "thunk",
    type: "Function",
    description: "The function to invoke before instantiating the class. It receives the parameters that will be passed to the class constructor."
  }]
});
*/
export default function haxClass(target, name, thunk) {
  hax(target, name, (original, args) => {
    thunk(args);
    // bind's context argument
    args.unshift(null);
    var classFunc = original.bind.apply(original, args);
    // totes m'goats you didn't know the parens were optional when instantiating a javascript object.
    return new classFunc;
  });
};
