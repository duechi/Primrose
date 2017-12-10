/*
pliny.method({
  parent: "Promise",
  name: "log",
  description: "Inject a logging call that inspects the promise's current return object before passing it along, unmodified.",
  parameters: [{
    name: "args",
    type: "Array",
    description: "An array of arguments that will have the promise's object appended to it before being `apply`d to console.log."
  }]
});
*/
Promise.prototype.log = function(args){
  args = args || [];
  return this.then(function(obj) {
    console.log.apply(console, args.concat([obj]));
    return obj;
  });
};

/*
pliny.function({
  parent: "Util",
  name: "promisify",
  description: "Helps convert old Node-style callback-based asynchronous functions to the new Promise-based style that is nicer to work with and will also work better with async/await whenever it perpetuates out into the cosmos."
  parameters: [{
    name: "thunk",
    type: "Function",
    description: "The function in need of promisifying."
  }, {
    name: "defaultResults",
    type: "Object",
    optional: true,
    description: "The value to return if the callback doesn't return a value."
  }]
});
*/
export default function promisify(thunk, defaultResults) {
  return new Promise((resolve, reject) => {
    const returnValue = thunk(function(err, results) {
      if(err){
        reject(err);
      }
      else{
        resolve(results || returnValue || defaultResults);
      }
    });
  });
}
