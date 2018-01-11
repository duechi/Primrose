import { coalesce, dynamicInvoke } from "../../util";

import BasePlugin from "../BasePlugin";

import { checkCommands } from "./Commands";
import GroundPhysics from "./GroundPhysics";


export default class BaseEnginePlugin extends BasePlugin {

  constructor(options, defaults) {
    super("PhysicsEngine", options, coalesce({
      allowSleep: true,
      gravity: -9.8
    }, defaults));

    this._toRemove = [];
    this._gravity = null;
    this._allowSleep = null;
  }

  get requirements() {
    const reqs = ["scene", "entities"];
    return checkCommands(this, reqs);
  }

  _install(env) {
    env.physics = this;
    return [new GroundPhysics()];
  }

  _onstarted() {
    this.gravity = this.options.gravity;
    this.allowSleep = this.options.allowSleep;
  }

  preUpdate(env, dt) {
    for(let i = 0; i < env.entities.count; ++i) {
      const ent = env.entities.get(i);
      if(ent.physMapped) {
        if(ent.parent != null) {
          for(let j = 0; j < ent.commands.length; ++j) {
            const args = ent.commands[j];
            args.splice(1, 0, i);
            dynamicInvoke(this, args);
          }
          ent.commands.length = 0;

          if(ent.changed) {
            this.setPhysicsState(i,
              ent.position.x, ent.position.y, ent.position.z,
              ent.quaternion.x, ent.quaternion.y, ent.quaternion.z, ent.quaternion.w,
              ent.velocity.x, ent.velocity.y, ent.velocity.z,
              ent.angularVelocity.x, ent.angularVelocity.y, ent.angularVelocity.z);
            ent.commit();
          }
        }
        else {
          this._toRemove.push(i);
        }
      }
    }

    if(this._toRemove.length > 0) {
      for(let n = 0; n < this._toRemove.length; ++n) {
        const i = this._toRemove[n],
          ent = env.entities.get(i);

        this.removeBody(i);
        ent.physMapped = false;
        env.entities.remove(i);
      }
      this._toRemove.length = 0;
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
