import { FogExp2 } from "three";

import BasePlugin from "./BasePlugin";

/*
pliny.class({
  parent: "Primrose.Plugin",
  baseClass: "Primrose.Plugin.BasePlugin",
  name: "Fog",
  description: "Installs fog in the BrowserEnvironment"
});
*/
export default class Fog extends BasePlugin {

  constructor() {
    super(null);
  }

  install(env) {
    if(env && env.scene) {
      env.scene.fog = new FogExp2(env.options.backgroundColor, 1 / Math.sqrt(env.options.drawDistance));
    }
  }

};
