import { PCFSoftShadowMap } from "three";

import BasePlugin from "../../BasePlugin";

/*
pliny.class({
  parent: "Primrose.Graphics.Shadows",
  baseClass: "Primrose.BasePlugin",
  name: "EnableShadows",
  description: "Installs shadow mapping on the renderer in the BrowserEnvironment"
});
*/
export default class EnableShadows extends BasePlugin {

  constructor() {
    super("EnableShadows");
  }

  get requirements() {
    return ["renderer"];
  }

  install(env) {
    env.renderer.shadowMap.enabled = true;
    env.renderer.shadowMap.type = PCFSoftShadowMap;
  }

};
