/*
pliny.method({
  parent: "THREE.Geometry",
  name: "colored",
  description: "Apply a color to a geometry, creating the intermediate material as necessary, and returning the resulting mesh. Calls [`Live API.colored`](#LiveAPI_colored) under the hood.",
  returns: "THREE.Mesh",
  parameters: [{
    name: "color",
    type: "Number",
    description: "A hexadecimal color value in RGB format."
  }, {
    name: "options",
    type: "Live API.colored.optionsHash",
    optional: true,
    description: "Options to pass on to [`material()`](#LiveAPI_material), or infrequently-used options to change the behavior of the setup. See [`Live API.colored.optionsHash`](#LiveAPI_colored_optionsHash) and [`Live API.material.optionsHash`](#LiveAPI_material_optionsHash) for more information."
  }]
});

pliny.method({
  parent: "THREE.BufferGeometry",
  name: "colored",
  description: "Apply a color to a geometry, creating the intermediate material as necessary, and returning the resulting mesh. Calls [`Live API.colored`](#LiveAPI_colored) under the hood.",
  returns: "THREE.Mesh",
  parameters: [{
    name: "color",
    type: "Number",
    description: "A hexadecimal color value in RGB format."
  }, {
    name: "options",
    type: "Live API.colored.optionsHash",
    optional: true,
    description: "Options to pass on to [`material()`](#LiveAPI_material), or infrequently-used options to change the behavior of the setup. See [`Live API.colored.optionsHash`](#LiveAPI_colored_optionsHash) and [`Live API.material.optionsHash`](#LiveAPI_material_optionsHash) for more information."
  }]
});

pliny.method({
  parent: "THREE.Mesh",
  name: "colored",
  description: "Apply a color to a geometry, creating the intermediate material as necessary, and returning the resulting mesh. Calls [`Live API.colored`](#LiveAPI_colored) under the hood.",
  returns: "THREE.Mesh",
  parameters: [{
    name: "color",
    type: "Number",
    description: "A hexadecimal color value in RGB format."
  }, {
    name: "options",
    type: "Live API.colored.optionsHash",
    optional: true,
    description: "Options to pass on to [`material()`](#LiveAPI_material), or infrequently-used options to change the behavior of the setup. See [`Live API.colored.optionsHash`](#LiveAPI_colored_optionsHash) and [`Live API.material.optionsHash`](#LiveAPI_material_optionsHash) for more information."
  }]
});
*/

import { BufferGeometry, Geometry, Mesh } from "three";

import { colored } from "../live-api";


BufferGeometry.prototype.colored =
Geometry.prototype.colored =
Mesh.prototype.colored =
  function coloredObject(color, options){
    return colored(this, color, options);
  };
