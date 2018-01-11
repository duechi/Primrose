import BaseEnginePlugin from "./BaseEnginePlugin";
import { CommandsByName } from "./Commands";
import RPCBuffer from "./RPCBuffer";
import InWorkerThreadEngine from "./InWorkerThreadEngine";

export default class InWorkerThreadWithTransferablesEngine extends InWorkerThreadEngine {
  constructor(options) {
    super(options);

    this.rpc = new RPCBuffer();
    this._transferables = [];
    this._worker.postMessage("transferablesMode");
  }

  _onmessage(evt) {
    this.rpc.buffer = evt.data;
    while(this.rpc.available) {
      const id = this.rpc.shift(),
        ent = this.entities.get(id);
      if(ent && !ent.changed) {
        ent.position.set(
          this.rpc.shift(),
          this.rpc.shift(),
          this.rpc.shift());

        ent.quaternion.set(
          this.rpc.shift(),
          this.rpc.shift(),
          this.rpc.shift(),
          this.rpc.shift());

        ent.velocity.set(
          this.rpc.shift(),
          this.rpc.shift(),
          this.rpc.shift());

        ent.angularVelocity.set(
          this.rpc.shift(),
          this.rpc.shift(),
          this.rpc.shift());

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
      super.post(data);
    }
  }

  preUpdate(env, dt) {
    super.preUpdate(env, dt);
    if(this.rpc.length > 1) {
      this.post(this.rpc.detach(), true);
    }
  }

  setGravity(v) {
    this.rpc.push(CommandsByName.setGravity.id);
    this.rpc.push(v);
  }

  enableAllowSleep() {
    this.rpc.push(CommandsByName.enableAllowSleep.id);
  }

  disableAllowSleep() {
    this.rpc.push(CommandsByName.disableAllowSleep.id);
  }

  newBody(id, mass, type) {
    this.rpc.push(CommandsByName.newBody.id);
    this.rpc.push(id);
    this.rpc.push(mass);
    this.rpc.push(type);
  }

  removeBody(id) {
    this.rpc.push(CommandsByName.removeBody.id);
    this.rpc.push(id);
  }

  addSphere(id, radius) {
    this.rpc.push(CommandsByName.addSphere.id);
    this.rpc.push(id);
    this.rpc.push(radius);
  }

  addBox(id, width, height, depth) {
    this.rpc.push(CommandsByName.addBox.id);
    this.rpc.push(id);
    this.rpc.push(width);
    this.rpc.push(height);
    this.rpc.push(depth);
  }

  addPlane(id) {
    this.rpc.push(CommandsByName.addPlane.id);
    this.rpc.push(id);
  }

  setPhysicsState(id,
    x, y, z,
    qx, qy, qz, qw,
    dx, dy, dz,
    adx, ady, adz) {
    this.rpc.push(CommandsByName.setPhysicsState.id);
    this.rpc.push(id);
    this.rpc.push(x);
    this.rpc.push(y);
    this.rpc.push(z);
    this.rpc.push(qx);
    this.rpc.push(qy);
    this.rpc.push(qz);
    this.rpc.push(qw);
    this.rpc.push(dx);
    this.rpc.push(dy);
    this.rpc.push(dz);
    this.rpc.push(adx);
    this.rpc.push(ady);
    this.rpc.push(adz);
  }

  setLinearDamping(id, v) {
    this.rpc.push(CommandsByName.setLinearDamping.id);
    this.rpc.push(id);
    this.rpc.push(v);
  }

  setAngularDamping(id, v) {
    this.rpc.push(CommandsByName.setAngularDamping.id);
    this.rpc.push(id);
    this.rpc.push(v);
  }

  addSpring(id1, id2, restLength, stiffness, damping) {
    this.rpc.push(CommandsByName.addSpring.id);
    this.rpc.push(id1);
    this.rpc.push(id2);
    this.rpc.push(restLength);
    this.rpc.push(stiffness);
    this.rpc.push(damping);
  }
}
