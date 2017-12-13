import { PCFSoftShadowMap } from "three";

import BasePlugin from "./BasePlugin";

/*
pliny.class({
  parent: "Primrose.Plugin",
  baseClass: "Primrose.Plugin.BasePlugin",
  name: "Shadows",
  description: "Installs shadow mapping in the BrowserEnvironment",
  parameters: [{
    name: "options",
    type: "Primrose.Plugin.Shadows.optionsHash",
    description: "Options for creating the shadow map"
  }]
});

pliny.record({
  parent: "Primrose.Plugin.Shadows",
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
    options = Object.assign({}, Shadows.DEFAULTS, options);
    super(options);
  }

  install(env) {
    if(env) {
      const r = env.renderer,
        sun = env.sky && env.sky.sun,
        ground = env.ground && env.ground.model;
      if(r) {
        r.shadowMap.enabled = true;
        r.shadowMap.type = PCFSoftShadowMap;
      }
      else {
        console.warn("Primrose.Plugin.Shadows > couldn't find the renderer.");
      }

      if(sun) {
        sun.castShadow = true;
        sun.shadow.mapSize.width =
        sun.shadow.mapSize.height = this.options.mapSize;
        sun.shadow.radius = this.options.radius;
        sun.shadow.camera.top = sun.shadow.camera.right = this.options.cameraSize;
        sun.shadow.camera.bottom = sun.shadow.camera.left = -this.options.cameraSize;
        sun.shadow.camera.updateProjectionMatrix();
      }
      else {
        console.warn("Primrose.Plugin.Shadows > couldn't find the sun.");
      }

      if(ground) {
        if(ground.isMesh) {
          ground.receiveShadow = true;
        }
        else if(ground.children) {
          ground.children
            .forEach((child) => child.receiveShadow = true);
        }
      }
      else {
        console.warn("Primrose.Plugin.Shadows > couldn't find the ground.");
      }
    }
  }

};

Shadows.DEFAULTS = {
  mapSize: 2048,
  cameraSize: 15,
  radius: 1
};
