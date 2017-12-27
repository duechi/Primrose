import { FogExp2 } from "three";

import BasePlugin from "../BasePlugin";

/*
pliny.class({
  parent: "Primrose.Graphics",
  baseClass: "Primrose.BasePlugin",
  name: "FogPlugin",
  description: "Installs fog in the BrowserEnvironment"
});
*/
export default class FogPlugin extends BasePlugin {

  constructor() {
    super("Fog");
  }

  get requirements() {
    return ["scene"];
  }

  _install(env) {
    env.scene.fog = new FogExp2(env.options.backgroundColor, 1 / Math.sqrt(env.options.drawDistance));
  }

};
