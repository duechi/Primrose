import BaseServerPlugin from "./BaseServerPlugin";
import { CommandIDs } from "./Commands";

const rpcQueue = [];

function pq() {
  rpcQueue.push.apply(rpcQueue, arguments);
}

function recv(ent, arr, i) {
  if(!ent.changed) {
    ent.position.fromArray(arr, i + 1);
    ent.quaternion.fromArray(arr, i + 4);
    ent.velocity.fromArray(arr, i + 8);
    ent.angularVelocity.fromArray(arr, i + 11);
    ent.updateMatrix();
    ent.commit();
  }
  return i + 14;
}

export default class InWorkerThreadServer extends BaseServerPlugin {
  constructor(options) {
    super(options);

    this._workerReady = false;
    this._worker = new Worker(this.options.workerPath);
    this._worker.onmessage = (evt) => {
      let i = 0;
      while(i < evt.data.length) {
        const id = evt.data[i],
          ent = env.entities.get(id);
        if(ent) {
          i = recv(ent, evt.data, i);
        }
      }
      this._workerReady = true;
    };
  }

  _install(env) {
    const childDependencies = super._install(env);
    this._workerReady = true;
    return childDependencies;
  }

  start() {
    this._worker.postMessage("start");
  }

  stop() {
    this._worker.postMessage("stop");
  }

  preUpdate(env, dt) {
    if(this._workerReady) {
      super.preUpdate(env, dt);
      if(rpcQueue.length > 0) {
        this._workerReady = false;
        this._worker.postMessage(rpcQueue);
        rpcQueue.length = 0;
      }
    }
  }

  setGravity(v) {
    pq(CommandIDs["setGravity"], v);
  }

  enableAllowSleep() {
    pq(CommandIDs["enableAllowSleep"]);
  }

  disableAllowSleep() {
    pq(CommandIDs["disableAllowSleep"]);
  }

  newBody(id, mass, type) {
    pq(CommandIDs["newBody"], id, mass, type);
  }

  addSphere(id, radius) {
    pq(CommandIDs["addSphere"], id, radius);
  }

  addBox(id, width, height, depth) {
    pq(CommandIDs["addBox"], id, width, height, depth);
  }

  addPlane(id) {
    pq(CommandIDs["addPlane"], id);
  }

  setPosition(id, x, y, z) {
    pq(CommandIDs["setPosition"], id, x, y, z);
  }

  setQuaternion(id, x, y, z, w) {
    pq(CommandIDs["setQuaternion"], id, x, y, z, w);
  }

  setVelocity(id, x, y, z) {
    pq(CommandIDs["setVelocity"], id, x, y, z);
  }

  setAngularVelocity(id, x, y, z) {
    pq(CommandIDs["setAngularVelocity"], id, x, y, z);
  }

  setLinearDamping(id, v) {
    pq(CommandIDs["setLinearDamping"], id, v);
  }

  setAngularDamping(id, v) {
    pq(CommandIDs["setAngularDamping"], id, v);
  }

  addSpring(id1, id2, restLength, stiffness, damping) {
    pq(CommandIDs["addSpring"], id1, id2, restLength, stiffness, damping);
  }
}
