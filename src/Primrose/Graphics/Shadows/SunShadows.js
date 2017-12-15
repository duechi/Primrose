import BasePlugin from "../../BasePlugin";

/*
pliny.class({
  parent: "Primrose.Graphics.Shadows",
  baseClass: "Primrose.BasePlugin",
  name: "SunShadows",
  description: "Installs shadow mapping from the Sun in the BrowserEnvironment",
  parameters: [{
    name: "options",
    type: "Primrose.Graphics.Shadows.SunShadows.optionsHash",
    description: "Options for creating the shadow map"
  }]
});

pliny.record({
  parent: "Primrose.Graphics.Shadows.SunShadows",
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
export default class SunShadows extends BasePlugin {

  constructor(options) {
    super("SunShadows", options, {
      mapSize: 2048,
      cameraSize: 15,
      radius: 1
    });
  }

  get requirements() {
    return ["sky.sun"];
  }

  _install(env) {
    const sun = env.sky.sun;
    sun.castShadow = true;
    sun.shadow.mapSize.width =
    sun.shadow.mapSize.height = this.options.mapSize;
    sun.shadow.radius = this.options.radius;
    sun.shadow.camera.top = sun.shadow.camera.right = this.options.cameraSize;
    sun.shadow.camera.bottom = sun.shadow.camera.left = -this.options.cameraSize;
    sun.shadow.camera.updateProjectionMatrix();
  }

};
