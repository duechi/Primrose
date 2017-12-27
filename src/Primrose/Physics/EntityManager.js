import BasePlugin from "../BasePlugin";

import GroundPhysics from "./GroundPhysics";

import InWorkerThreadServer from "./InWorkerThreadServer";
import InRenderThreadServer from "./InRenderThreadServer";

const rpcQueue = [];

function pq() {
  rpcQueue.push.apply(rpcQueue, arguments);
  rpcQueue.push("END");
}

export default class EntityManager extends BasePlugin {
  constructor(options) {
    super("EntityManager", options, {
      gravity: -9.8
    });

    this._server = new InRenderThreadServer("/Primrose/PrimrosePhysics.js");

    this._server.addEventListener("data", (evt) => {
      const arr = evt.data;
      let i = 0;
      while(i < arr.length) {
        const id = arr[i],
          ent = EntityManager.entityDB[id];
        if(ent) {
          i = ent.recv(arr, i);
        }
        else {
          ++i;
          console.log(i);
        }
      }
    });
    
    this._gravity = null;
    this.gravity = this.options.gravity;
  }

  get gravity() {
    return this._gravity;
  }

  set gravity(v) {
    this._gravity = v;
    this.cmd("gravity", v);
  }

  get requirements() {
    return ["scene"];
  }

  _install(env, dt) {
    env.physics = this;
    return [new GroundPhysics()];
  }

  start() {
    this.cmd("start");
  }

  stop() {
    this.cmd("stop");
  }

  preUpdate(env, dt) {
    for(let i = 0; i < EntityManager.entities.length; ++i) {
      this.check(EntityManager.entities[i]);
    }

    this.flush();
  }

  check(ent) {
    if(ent.physMapped) {
      for(let i = 0; i < ent.commands.length; ++i) {
        pq.apply(null, ent.commands[i]);
      }
      ent.commands.length = 0;

      if(!ent.position.equals(ent._lastPosition)) {
        pq("position", ent.uuid, ent.position.x, ent.position.y, ent.position.z);
        ent._lastPosition.copy(ent.position);
      }

      if(!ent.quaternion.equals(ent._lastQuaternion)) {
        pq("quaternion", ent.uuid, ent.quaternion.x, ent.quaternion.y, ent.quaternion.z, ent.quaternion.w);
        ent._lastQuaternion.copy(ent.quaternion);
      }

      if(!ent.velocity.equals(ent._lastVelocity)) {
        pq("velocity", ent.uuid, ent.velocity.x, ent.velocity.y, ent.velocity.z);
        ent._lastVelocity.copy(ent.velocity);
      }

      if(!ent.angularVelocity.equals(ent._lastAngularVelocity)) {
        pq("angularVelocity", ent.uuid, ent.angularVelocity.x, ent.angularVelocity.y, ent.angularVelocity.z);
        ent._lastAngularVelocity.copy(ent.angularVelocity);
      }

      if(ent.linearDamping !== ent._lastLinearDamping) {
        pq("linearDamping", ent.uuid, ent.linearDamping); 
        ent._lastLinearDamping = ent.linearDamping;
      }

      if(ent.angularDamping !== ent._lastAngularDamping) {
        pq("angularDamping", ent.uuid, ent.angularDamping);
        ent._lastAngularDamping = ent.angularDamping;
      }
    }
  }

  postUpdate(env, dt) {
    for(let i = 0; i < EntityManager.entities.length; ++i) {
      EntityManager.entities[i].update();
    }
  }

  cmd() {
    pq.apply(this, arguments);
    this.flush();
  }

  flush() {
    if(rpcQueue.length > 0) {
      this._server.send(rpcQueue);
      rpcQueue.length = 0;
    }
  }
}

EntityManager.entities = [];
EntityManager.entityDB = {};