import BaseEnginePlugin from "./BaseEnginePlugin";
import { CommandsByName } from "./Commands";
import RPCBuffer from "./RPCBuffer";
import InWorkerThreadEngine from "./InWorkerThreadEngine";

export default class InWorkerThreadWithTransferablesEngine extends InWorkerThreadEngine {
  constructor(options) {
    super(options);

    this.rpc = null;
    this._transferables = [];
    this._worker.postMessage("transferablesMode");
    this._resolveWorkerReady = null;
    this._workerReady = new Promise((resolve, reject) => {
      this._resolveWorkerReady = resolve;
    });
  }

  _onmessage(evt) {
    if(this.rpc === null) {
      this.rpc = new RPCBuffer(evt.data);
      this._resolveWorkerReady();
    }
    else {
      this.rpc.buffer = evt.data;
    }

    while(this.rpc.available) {
      const id = this.rpc.remove(),
        ent = this.entities.get(id);
      if(ent && !ent.changed) {
        ent.position.set(
          this.rpc.remove(),
          this.rpc.remove(),
          this.rpc.remove());

        ent.quaternion.set(
          this.rpc.remove(),
          this.rpc.remove(),
          this.rpc.remove(),
          this.rpc.remove());

        ent.velocity.set(
          this.rpc.remove(),
          this.rpc.remove(),
          this.rpc.remove());

        ent.angularVelocity.set(
          this.rpc.remove(),
          this.rpc.remove(),
          this.rpc.remove());

        ent.updateMatrix();
        ent.commit();
      }
    }

    this.rpc.rewind();
  }

  post(data, transfer) {
    if(transfer) {
      this._transferables[0] = data;
      this._worker.postMessage(data, this._transferables);
    }
    else {
      return super.post(data);
    }
  }

  _onstarted() {
    return this._workerReady();
  }

  preUpdate(env, dt) {
    if(this.rpc && this.rpc.ready) {
      super.preUpdate(env, dt);
      this.post(this.rpc.buffer, true);
    }
  }

  setGravity(v) {
    this.rpc.add(CommandsByName.setGravity.id);
    this.rpc.add(v);
  }

  enableAllowSleep() {
    this.rpc.add(CommandsByName.enableAllowSleep.id);
  }

  disableAllowSleep() {
    this.rpc.add(CommandsByName.disableAllowSleep.id);
  }

  newBody(id, mass, type) {
    this.rpc.add(CommandsByName.newBody.id);
    this.rpc.add(id);
    this.rpc.add(mass);
    this.rpc.add(type);
  }

  removeBody(id) {
    this.rpc.add(CommandsByName.removeBody.id);
    this.rpc.add(id);
  }

  addSphere(id, radius) {
    this.rpc.add(CommandsByName.addSphere.id);
    this.rpc.add(id);
    this.rpc.add(radius);
  }

  addBox(id, width, height, depth) {
    this.rpc.add(CommandsByName.addBox.id);
    this.rpc.add(id);
    this.rpc.add(width);
    this.rpc.add(height);
    this.rpc.add(depth);
  }

  addPlane(id) {
    this.rpc.add(CommandsByName.addPlane.id);
    this.rpc.add(id);
  }

  setPhysicsState(id, 
    x, y, z,
    qx, qy, qz, qw,
    dx, dy, dz, 
    adx, ady, adz) {
    this.rpc.add(CommandsByName.setPhysicsState.id);
    this.rpc.add(id);
    this.rpc.add(x);
    this.rpc.add(y);
    this.rpc.add(z);
    this.rpc.add(qx);
    this.rpc.add(qy);
    this.rpc.add(qz);
    this.rpc.add(qw);
    this.rpc.add(dx);
    this.rpc.add(dy);
    this.rpc.add(dz);
    this.rpc.add(adx);
    this.rpc.add(ady);
    this.rpc.add(adz);
  }

  setLinearDamping(id, v) {
    this.rpc.add(CommandsByName.setLinearDamping.id);
    this.rpc.add(id);
    this.rpc.add(v);
  }

  setAngularDamping(id, v) {
    this.rpc.add(CommandsByName.setAngularDamping.id);
    this.rpc.add(id);
    this.rpc.add(v);
  }

  addSpring(id1, id2, restLength, stiffness, damping) {
    this.rpc.add(CommandsByName.addSpring.id);
    this.rpc.add(id1);
    this.rpc.add(id2);
    this.rpc.add(restLength);
    this.rpc.add(stiffness);
    this.rpc.add(damping);
  }
}
