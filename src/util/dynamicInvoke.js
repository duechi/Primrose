export default function dynamicInvoke(obj, args) {
  const name = args.shift(),
    handler = obj[name];
  if(handler) {
    handler.apply(obj, args);
  }
  else {
    console.error("no", name, "in", obj);
  }
};
