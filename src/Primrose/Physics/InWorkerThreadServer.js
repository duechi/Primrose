import BaseServerPlugin from "./BaseServerPlugin";
import { Commands, CommandIDs } from "./Commands";
import RPCBuffer from "./RPCBuffer";

const rpc = new RPCBuffer();

function pq() {
  for(let i = 0; i < arguments.length; ++i) {
    rpc.add(arguments[i]);
  }
}

export default class InWorkerThreadServer extends BaseServerPlugin {
  constructor(options) {
    super(options);

    this.rpc = rpc;

    this.entities = null;
    this._workerReady = false;
    this._worker = new Worker(this.options.workerPath);
    this._worker.onmessage = (evt) => {
      if(evt.data === "ready") {
        this._workerReady = true;
      }
      else {
        rpc.buffer = evt.data;

        while(rpc.available) {
          const id = rpc.remove(),
            ent = this.entities.get(id);
          if(ent && !ent.changed) {
            ent.position.set(
              rpc.remove(),
              rpc.remove(),
              rpc.remove());

            ent.quaternion.set(
              rpc.remove(),
              rpc.remove(),
              rpc.remove(),
              rpc.remove());

            ent.velocity.set(
              rpc.remove(),
              rpc.remove(),
              rpc.remove());

            ent.angularVelocity.set(
              rpc.remove(),
              rpc.remove(),
              rpc.remove());

            ent.updateMatrix();
            ent.commit();
          }
        }

        rpc.rewind();
      }
    };
  }

  _install(env) {
    this.entities = env.entities;
    return super._install(env);
  }

  start() {
    this._worker.postMessage("start");
  }

  stop() {
    this._worker.postMessage("stop");
  }

  preUpdate(env, dt) {
    if(this._workerReady && rpc.ready) {
      super.preUpdate(env, dt);
      this._worker.postMessage(rpc.buffer, [rpc.buffer]);
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
