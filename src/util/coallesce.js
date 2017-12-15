export default function coallesce() {
  const obj = arguments[0];
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
