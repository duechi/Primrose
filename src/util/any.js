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
  }],

  examples: [{
    name: "Basic usage",
    description: `To find out if any elements in an array satisfy a certain condition:

## Code:

  grammar("JavaScript");
  const testData = [1, 2, null, 4];
  console.log(arr, (o) => o instanceof Function));
  console.log(arr, (o) => o === null));
  console.log(arr, (o) => o + 2 === 4));

## Results:
> false
> true
> true`
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
