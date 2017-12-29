/*
pliny.function({
  parent: "Primrose.Random",
  name: "color",
  description: "Returns a random hex RGB number to be used as a color.",
  returns: "Number",
  examples: [{
    name: "Generate a random color.",
    description: "To generate colors at random, call the `Primrose.Random.color()` function:\n\
\n\
## Code:\n\
\n\
  grammar(\"JavaScript\");\n\
  for(var i = 0; i < 10; ++i){\n\
    console.log(Primrose.Random.color().toString(16));\n\
  }\n\
\n\
## Result (note that this is just one possible outcome):\n\
> 351233\n\
> 3e8e9\n\
> 8a85a6\n\
> 5fad58\n\
> 17fe2b\n\
> d4b42b\n\
> e986bf\n\
> 38541a\n\
> 5a19db\n\
> 5f5c50"
  }]
});
*/

import randInt from "./int";


export default function color(n = 256, monochromatic = false) {
  if(n < 2) {
    return 0xffffff;
  }
  else {
    const f = 255 / (n - 1),
      r = f * randInt(0, n);

    let g = r,
      b = r;

    if(!monochromatic) {
      g = f * randInt(0, n);
      b = f * randInt(0, n);
    }

    return Math.floor(r) << 16 | Math.floor(g) << 8 | Math.floor(b);
  }
};
