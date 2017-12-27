import { coalesce, dynamicInvoke } from "../../util";

import BasePlugin from "../BasePlugin";

import EntityManager from "./EntityManager";
import GroundPhysics from "./GroundPhysics";

const COMMANDS = [
  "setAllowSleep",
  "setGravity",
  "newBody",
  "addSphere",
  "addBox",
  "addPlane",
  "setPosition",
  "setQuaternion",
  "setVelocity",
  "setAngularVelocity",
  "setLinearDamping",
  "setAngularDamping"];

export default class BaseServerPlugin extends BasePlugin {

  constructor(setup, options, defaults) {
    super("PhysicsServer", options, coalesce({
      allowSleep: true,
      gravity: -9.8
    }, defaults));


    COMMANDS.forEach((name) =>
        this[name] = null);

    this._setup = setup;
    this._gravity = null;
    this._allowSleep = null;
  }

  get requirements() {
    return ["scene", "entities"];
  }

  _install(env) {
    env.physics = this;

    COMMANDS.forEach((name) =>
      this[name] = this._setup(name));

    this.gravity = this.options.gravity;
    this.allowSleep = this.options.allowSleep;

    return [new GroundPhysics()];
  }

  preUpdate(env, dt) {
    for(let i = 0; i < EntityManager.entities.length; ++i) {
      const ent = EntityManager.entities[i];

      if(ent.physMapped) {
        for(let i = 0; i < ent.commands.length; ++i) {
          dynamicInvoke(this, ent.commands[i]);
        }
        ent.commands.length = 0;

        if(!ent.position.equals(ent._lastPosition)) {
          this.setPosition(ent.uuid, ent.position.x, ent.position.y, ent.position.z);
        }

        if(!ent.quaternion.equals(ent._lastQuaternion)) {
          this.setQuaternion(ent.uuid, ent.quaternion.x, ent.quaternion.y, ent.quaternion.z, ent.quaternion.w);
        }

        if(!ent.velocity.equals(ent._lastVelocity)) {
          this.setVelocity(ent.uuid, ent.velocity.x, ent.velocity.y, ent.velocity.z);
        }

        if(!ent.angularVelocity.equals(ent._lastAngularVelocity)) {
          this.setAngularVelocity(ent.uuid, ent.angularVelocity.x, ent.angularVelocity.y, ent.angularVelocity.z);
        }

        if(ent.linearDamping !== ent._lastLinearDamping) {
          this.setLinearDamping(ent.uuid, ent.linearDamping);
        }

        if(ent.angularDamping !== ent._lastAngularDamping) {
          this.setAngularDamping(ent.uuid, ent.angularDamping);
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
    this.setAllowSleep(v);
  }

  get gravity() {
    return this._gravity;
  }

  set gravity(v) {
    this._gravity = v;
    this.setGravity(v);
  }

  setGravity(v) {
    throw new Error("Not implemented: Primrose.Physics.BaseServerPlugin::setGravity(v)");
  }

  newBody(id, mass, type) {
    throw new Error("Not implemented: Primrose.Physics.BaseServerPlugin::newBody(id, mass, type)");
  }

  addSphere(id, radius) {
    throw new Error("Not implemented: Primrose.Physics.BaseServerPlugin::addSphere(id, radius)");
  }

  addBox(id, width, height, depth) {
    throw new Error("Not implemented: Primrose.Physics.BaseServerPlugin::addBox(id, width, height, depth)");
  }

  addPlane(id) {
    throw new Error("Not implemented: Primrose.Physics.BaseServerPlugin::addPlane(id)");
  }

  setPosition(id, x, y, z) {
    throw new Error("Not implemented: Primrose.Physics.BaseServerPlugin::setPosition(id, x, y, z)");
  }

  setQuaternion(id, x, y, z, w) {
    throw new Error("Not implemented: Primrose.Physics.BaseServerPlugin::setQuaternion(id, x, y, z, w)");
  }

  setVelocity(id, x, y, z) {
    throw new Error("Not implemented: Primrose.Physics.BaseServerPlugin::setVelocity(id, x, y, z)");
  }

  setAngularVelocity(id, x, y, z) {
    throw new Error("Not implemented: Primrose.Physics.BaseServerPlugin::setAngularVelocity(id, x, y, z)");
  }

  setLinearDamping(id, v) {
    throw new Error("Not implemented: Primrose.Physics.BaseServerPlugin::setLinearDamping(id, v)");
  }

  setAngularDamping(id, v) {
    throw new Error("Not implemented: Primrose.Physics.BaseServerPlugin::setAngularDamping(id, v)");
  }
}
