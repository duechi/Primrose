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
    return ["ground.isInfinite"];
  }

  _install(env) {
    env.ground.ready.then(() =>
      env.ground.phys({
        mass: 0,
        type: 4 // CANNON.Body.KINEMATIC
      }));
  }

};
