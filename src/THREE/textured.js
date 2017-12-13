/*
pliny.method({
  parent: "THREE.Geometry",
  name: "textured",
  description: "Apply a texture to a geometry, creating the intermediate material as necessary, and returning the resulting mesh. Calls [`Live API.textured`](#LiveAPI_textured) under the hood.",
  returns: "THREE.Mesh",
  parameters: [{
    name: "texture",
    type: "one of: [String, 6-item Array of String, Primrose.Controls.Surface, HTMLCanvasElement, HTMLVideoElement, HTMLImageElement, THREE.Texture]",
    description: "A texture description."
  }, {
    name: "options",
    type: "Live API.textured.optionsHash",
    optional: true,
    description: "Options to pass on to [`material()`](#LiveAPI_material), or infrequently-used options to change the behavior of the setup. See [`Live API.textured.optionsHash`](#LiveAPI_textured_optionsHash) and [`Live API.material.optionsHash`](#LiveAPI_material_optionsHash) for more information."
  }]
});

pliny.method({
  parent: "THREE.BufferGeometry",
  name: "textured",
  description: "Apply a texture to a geometry, creating the intermediate material as necessary, and returning the resulting mesh. Calls [`Live API.textured`](#LiveAPI_textured) under the hood.",
  returns: "THREE.Mesh",
  parameters: [{
    name: "texture",
    type: "one of: [String, 6-item Array of String, Primrose.Controls.Surface, HTMLCanvasElement, HTMLVideoElement, HTMLImageElement, THREE.Texture]",
  }, {
    name: "options",
    type: "Live API.textured.optionsHash",
    optional: true,
    description: "Options to pass on to [`material()`](#LiveAPI_material), or infrequently-used options to change the behavior of the setup. See [`Live API.textured.optionsHash`](#LiveAPI_textured_optionsHash) and [`Live API.material.optionsHash`](#LiveAPI_material_optionsHash) for more information."
  }]
});

pliny.method({
  parent: "THREE.Mesh",
  name: "textured",
  description: "Apply a texture to a geometry, creating the intermediate material as necessary, and returning the resulting mesh. Calls [`Live API.textured`](#LiveAPI_textured) under the hood.",
  returns: "THREE.Mesh",
  parameters: [{
    name: "texture",
    type: "one of: [String, 6-item Array of String, Primrose.Controls.Surface, HTMLCanvasElement, HTMLVideoElement, HTMLImageElement, THREE.Texture]",    description: "A texture description."
  }, {
    name: "options",
    type: "Live API.textured.optionsHash",
    optional: true,
    description: "Options to pass on to [`material()`](#LiveAPI_material), or infrequently-used options to change the behavior of the setup. See [`Live API.textured.optionsHash`](#LiveAPI_textured_optionsHash) and [`Live API.material.optionsHash`](#LiveAPI_material_optionsHash) for more information."
  }]
});
*/

import { BufferGeometry, Geometry, Mesh } from "three";

import { textured } from "../live-api";


BufferGeometry.prototype.textured =
Geometry.prototype.textured =
Mesh.prototype.textured =
  function(texture, options) {
    return textured(this, texture, options);
  };
