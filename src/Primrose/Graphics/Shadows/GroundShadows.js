import BasePlugin from "../../BasePlugin";

/*
pliny.class({
  parent: "Primrose.Graphics.Shadows",
  baseClass: "Primrose.BasePlugin",
  name: "GroundShadows",
  description: "Installs shadow mapping on the ground in the BrowserEnvironment"
});
*/
export default class GroundShadows extends BasePlugin {

  constructor(options) {
    super("GroundShadows");
  }

  get requirements() {
    return ["ground.model"];
  }

  install(env) {
    const ground = env.ground.model;
    if(ground.isMesh) {
      ground.receiveShadow = true;
    }
    else if(ground.children) {
      ground.children
        .forEach((child) => child.receiveShadow = true);
    }
  }

};
