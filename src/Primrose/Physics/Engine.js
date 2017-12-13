import CANNON from "cannon";

import { preStepAllEntities, postStepAllEntities } from "../Controls/Entity";
import BasePlugin from "../BasePlugin";
import GroundPhysics from "./GroundPhysics";

/*
pliny.class({
  parent: "Primrose.Physics",
  baseClass: "Primrose.BasePlugin",
  name: "Engine",
  description: "Installs a physics subsystem, based on CANNON.js.",
  parameters: [{
    name: "options",
    type: "Primrose.Physics.Engine.optionsHash",
    description: "Options for creating the shadow map"
  }]
});

pliny.record({
  parent: "Primrose.Physics.Engine",
  name: "optionsHash",
  parameters: [{
    name: "gravity",
    type: "Number",
    optional: true,
    default: 9.8,
    description: "The acceleration applied to falling objects."
  }]
});
*/
export default class Engine extends BasePlugin {

  constructor(options) {
    super("PhysicsEngine", options, {
      gravity: -9.8
    });
  }

  get requirements() {
    return ["scene"];
  }

  install(env) {
    env.physics = new CANNON.World();
    env.physics.gravity.set(0, this.options.gravity, 0);
    env.physics.broadphase = new CANNON.NaiveBroadphase();
    env.physics.solver.iterations = 10;
    env.physics.addEventListener("preStep", preStepAllEntities);
    env.physics.addEventListener("postStep", postStepAllEntities);

    return [new GroundPhysics()];
  }

  preUpdate(env, dt) {
    for(let i = 0; i < env.scene.children.length; ++i) {
      const child = env.scene.children[i];
      if(env.physics && child.rigidBody && !child.rigidBody.world) {
        env.physics.addBody(child.rigidBody);
      }
    }
  }

  postUpdate(env, dt) {
    env.physics.step(env.deltaTime, dt);
  }

};
