import { coalesce, dynamicInvoke } from "../../util";

import BasePlugin from "../BasePlugin";

import { checkCommands } from "./Commands";
import GroundPhysics from "./GroundPhysics";


export default class BaseServerPlugin extends BasePlugin {

  constructor(options, defaults) {
    super("PhysicsServer", options, coalesce({
      allowSleep: true,
      gravity: -9.8
    }, defaults));

    this._gravity = null;
    this._allowSleep = null;
  }

  get requirements() {
    const reqs = ["scene", "entities"];
    return checkCommands(this, reqs);
  }

  _install(env) {
    env.physics = this;

    this.gravity = this.options.gravity;
    this.allowSleep = this.options.allowSleep;

    return [new GroundPhysics()];
  }

  preUpdate(env, dt) {
    for(let i = 0; i < env.entities.count; ++i) {
      const ent = env.entities.get(i);
      if(ent.physMapped) {
        for(let j = 0; j < ent.commands.length; ++j) {
          const args = ent.commands[j];
          args.splice(1, 0, i);
          dynamicInvoke(this, args);
        }
        ent.commands.length = 0;

        if(ent.positionChanged) {
          this.setPosition(i, ent.position.x, ent.position.y, ent.position.z);
        }

        if(ent.quaternionChanged) {
          this.setQuaternion(i, ent.quaternion.x, ent.quaternion.y, ent.quaternion.z, ent.quaternion.w);
        }

        if(ent.velocityChanged) {
          this.setVelocity(i, ent.velocity.x, ent.velocity.y, ent.velocity.z);
        }

        if(ent.angularVelocityChanged) {
          this.setAngularVelocity(i, ent.angularVelocity.x, ent.angularVelocity.y, ent.angularVelocity.z);
        }

        if(ent.linearDampingChanged) {
          this.setLinearDamping(i, ent.linearDamping);
        }

        if(ent.angularDampingChanged) {
          this.setAngularDamping(i, ent.angularDamping);
        }

        ent.commit();
      }
    }
  }

  get allowSleep() {
    return this._allowSleep;
  }

  set allowSleep(v) {
    this._allowSleep = v;
    if(v) {
      this.enableAllowSleep();
    }
    else{
      this.disableAllowSleep();
    }
  }

  get gravity() {
    return this._gravity;
  }

  set gravity(v) {
    this._gravity = v;
    this.setGravity(v);
  }
}
