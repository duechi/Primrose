import { PCFSoftShadowMap } from "three";

import BasePlugin from "../../BasePlugin";

import EnableShadows from "./EnableShadows";
import GroundShadows from "./GroundShadows";
import SunShadows from "./SunShadows";

/*
pliny.class({
  parent: "Primrose.Graphics",
  baseClass: "Primrose.BasePlugin",
  name: "Shadows",
  description: "Installs shadow mapping in the BrowserEnvironment",
  parameters: [{
    name: "options",
    type: "Primrose.Plugin.Shadows.optionsHash",
    description: "Options for creating the shadow map"
  }]
});

pliny.record({
  parent: "Primrose.Graphics.Shadows",
  name: "optionsHash",
  parameters: [{
    name: "mapSize",
    type: "Number",
    optional: true,
    default: 2048,
    description: "The size to use for the width and height of the shadow map that will be generated."
  }, {
    name: "radius",
    type: "Number",
    optional: true,
    default: 1,
    description: "The number of pixels of blurring to perform at the edge of the shadows."
  }, {
    name: "cameraSize",
    type: "Number",
    optional: true,
    default: 15,
    description: "The radius of the frustum of the shadow projecting camera."
  }]
});
*/
export default class Shadows extends BasePlugin {

  constructor(options) {
    super("Shadows", options);
  }

  get requirements() {
    return [];
  }

  _install(env) {
    return [
      new EnableShadows(),
      new GroundShadows(),
      new SunShadows(this.options)
    ];
  }

};
