/*
pliny.function({
  parent: "Util",
  name: "coalesce",
  returns: "Object",
  description: "Copies values from one object to another, skipping over any values that read as undefined. This function differs from the standard `Object.assign` in that `Object.assign` will copy values in a hash that are manually set to `undefined`.",
  parameters: [{
    name: "[varargs]",
    type: "Object",
    description: "This function accepts a variable number of arguments. The first parameter is the object to which values will be assigned. All subsequent parameters are objects from which values will be read.  If the first parameter is `null` or `undefined`, a new object will be created. If any of the other parameters are `null` or `undefined`, they will be skipped. Also returns the first parameter, for being able to capture the automatically-created object in the case of a missing first parameter."
  }],
  examples: [{
    name: "Basic usage",
    description: `This function is most often used to assign defaults to an object.

## Code:

  grammar("javascript");
  function myFunction(options) {
      options = coalesce({
      a: 2,
      b: 3,
      c: 4
    }, options);
    console.log(options.a);
    console.log(options.b);
    console.log(options.c);
    console.log(options.d);
  }

  myFunction({
    a: 5,
    c: undefined,
    d: 6
  });

## Results:
> 5
> 3
> 4
> 6`
  }]
});
*/
export default function coalesce() {
  const obj = arguments[0] || {};
  for(let i = 1; i < arguments.length; ++i) {
    const sub = arguments[i];
    if(sub) {
      for(let key in sub) {
        const val = sub[key];
        if(val !== undefined) {
          obj[key] = val;
        }
      }
    }
  }
  return obj;
}
