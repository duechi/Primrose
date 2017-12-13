/*
pliny.namespace({
  parent: "Primrose",
  name: "Graphics",
  description: "The Graphics namespace contains classes and functions that with 3D geometry."
});
*/

import fixGeometry from "./fixGeometry";
import Fog from "./Fog";
import InsideSphereGeometry from "./InsideSphereGeometry";
import loadTexture from "./loadTexture";
import ModelFactory from "./ModelFactory";
import Shadows from "./Shadows";

export {
  fixGeometry,
  Fog,
  InsideSphereGeometry,
  loadTexture,
  ModelFactory,
  Shadows
};

export default {
  fixGeometry,
  Fog,
  InsideSphereGeometry,
  loadTexture,
  ModelFactory,
  Shadows
};
