import hax from "./hax";

/*
pliny.function({
  parent: "Util",
  name: "haxFunction",
  description: "Intercept a function that is stored in a target object and inject our own code to run before the function is called.",
  parameters: [{
    name: "target",
    type: "Object",
    description: "The object in which the function is stored. Probably `window`."
  }, {
    name: "name",
    type: "String",
    description: "The name of the function, in the object store."
  }, {
    name: "thunk",
    type: "Function",
    description: "The function to invoke before calling the target function. It receives the parameters that will be passed to the target function."
  }]
});
*/
export default function haxFunction(target, name, thunk) {
  hax(target, name, (original, args) => {
    thunk(args);
    var returnValue = original.apply(target, args);
    return returnValue;
  });
};
