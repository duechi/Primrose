import { Mesh, Object3D } from "three";

import phys from "../live-api/phys";

/*
pliny.method({
  parent: "THREE.Object3D",
  name: "phys",
  description: "Make a 3D object react to physics updates. Calls `Live API.phys` under the hood.",
  returns: "Primrose.Controls.Entity",
  parameters: [{
    name: "options",
    type: "Live API.phys.optionsHash",
    description: "Optional settings for creating the physics settings."
  }]
});
*/
Object3D.prototype.phys = Mesh.prototype.phys = function(options) {
  return phys(this, options);
};
