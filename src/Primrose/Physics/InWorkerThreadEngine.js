import BaseEnginePlugin from "./BaseEnginePlugin";
import { Commands, CommandIDs } from "./Commands";
import RPCBuffer from "./RPCBuffer";

const rpc = new RPCBuffer();

export default class InWorkerThreadEngine extends BaseEnginePlugin {
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
    rpc.add(CommandIDs["setGravity"]);
    rpc.add(v);
  }

  enableAllowSleep() {
    rpc.add(CommandIDs["enableAllowSleep"]);
  }

  disableAllowSleep() {
    rpc.add(CommandIDs["disableAllowSleep"]);
  }

  newBody(id, mass, type) {
    rpc.add(CommandIDs["newBody"]);
    rpc.add(id);
    rpc.add(mass);
    rpc.add(type);
  }

  removeBody(id) {
    rpc.add(CommandIDs["removeBody"]);
    rpc.add(id);
  }

  addSphere(id, radius) {
    rpc.add(CommandIDs["addSphere"]);
    rpc.add(id);
    rpc.add(radius);
  }

  addBox(id, width, height, depth) {
    rpc.add(CommandIDs["addBox"]);
    rpc.add(id);
    rpc.add(width);
    rpc.add(height);
    rpc.add(depth);
  }

  addPlane(id) {
    rpc.add(CommandIDs["addPlane"]);
    rpc.add(id);
  }

  setPosition(id, x, y, z) {
    rpc.add(CommandIDs["setPosition"]);
    rpc.add(id);
    rpc.add(x);
    rpc.add(y);
    rpc.add(z);
  }

  setQuaternion(id, x, y, z, w) {
    rpc.add(CommandIDs["setQuaternion"]);
    rpc.add(id);
    rpc.add(x);
    rpc.add(y);
    rpc.add(z);
    rpc.add(w);
  }

  setVelocity(id, x, y, z) {
    rpc.add(CommandIDs["setVelocity"]);
    rpc.add(id);
    rpc.add(x);
    rpc.add(y);
    rpc.add(z);
  }

  setAngularVelocity(id, x, y, z) {
    rpc.add(CommandIDs["setAngularVelocity"]);
    rpc.add(id);
    rpc.add(x);
    rpc.add(y);
    rpc.add(z);
  }

  setLinearDamping(id, v) {
    rpc.add(CommandIDs["setLinearDamping"]);
    rpc.add(id);
    rpc.add(v);
  }

  setAngularDamping(id, v) {
    rpc.add(CommandIDs["setAngularDamping"]);
    rpc.add(id);
    rpc.add(v);
  }

  addSpring(id1, id2, restLength, stiffness, damping) {
    rpc.add(CommandIDs["addSpring"]);
    rpc.add(id1);
    rpc.add(id2);
    rpc.add(restLength);
    rpc.add(stiffness);
    rpc.add(damping);
  }
}
