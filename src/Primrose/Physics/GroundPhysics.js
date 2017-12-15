import BasePlugin from "../BasePlugin";

/*
pliny.class({
  parent: "Primrose.Plugin",
  baseClass: "Primrose.Plugin.BasePlugin",
  name: "GroundPhysics",
  description: "Adds the ground to the physics system."
});
*/
export default class GroundPhysics extends BasePlugin {

  constructor() {
    super("GroundPhysics");
  }

  get requirements() {
    return ["ground.rigidBody", "physics"];
  }

  _install(env) {
    env.physics.addBody(env.ground.rigidBody);
  }

};
