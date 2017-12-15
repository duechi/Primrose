/*
pliny.function({
  parent: "Util",
  name: "any",
  returns: "Boolean",
  description: "Returns true if any elements in an array-like object pass the given test.",
  parameters: [{
    name: "arr",
    type: "Array",
    description: "The array to test"
  }, {
    name: "test",
    type: "Function"<
    description: "The test to perform"
  }]
});
*/

export default function any(arr, test) {

  for(let i = 0; arr && i < arr.length; ++i) {
    if(test(arr[i])) {
      return true;
    }
  }

  return false;
};
