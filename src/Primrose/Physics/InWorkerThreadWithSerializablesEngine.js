import BaseEnginePlugin from "./BaseEnginePlugin";
import { CommandsByName } from "./Commands";
import RPCBuffer from "./RPCBuffer";
import InWorkerThreadEngine from "./InWorkerThreadEngine";

export default class InWorkerThreadWithSerializablesEngine extends InWorkerThreadEngine {
  constructor(options) {
    super(options);

    this._worker.postMessage("serializablesMode");
  }

  _onmessage(evt) {
    const values = JSON.parse(evt.data);
    let i = 0;
    while(i < values.length) {
      const id = values[i++],
        ent = this.entities.get(id);
      if(ent && !ent.changed) {
        ent.position.set(values[i++], values[i++], values[i++]);
        ent.quaternion.set(values[i++], values[i++], values[i++], values[i++]);
        ent.velocity.set(values[i++], values[i++], values[i++]);
        ent.angularVelocity.set(values[i++], values[i++], values[i++]);
        ent.updateMatrix();
        ent.commit();
      }
    }
  }

  setGravity(v) {
    CommandsByName.setGravity.params[0] = v;
    this.post(CommandsByName.setGravity);
  }

  enableAllowSleep() {
    this.post(CommandsByName.enableAllowSleep);
  }

  disableAllowSleep() {
    this.post(CommandsByName.disableAllowSleep);
  }

  newBody(id, mass, type) {
    CommandsByName.newBody.params[0] = id;
    CommandsByName.newBody.params[1] = mass;
    CommandsByName.newBody.params[2] = type;
    this.post(CommandsByName.newBody);
  }

  removeBody(id) {
    CommandsByName.removeBody.params[0] = id;
    this.post(CommandsByName.removeBody);
  }

  addSphere(id, radius) {
    CommandsByName.addSphere.params[0] = id;
    CommandsByName.addSphere.params[1] = radius;
    this.post(CommandsByName.addSphere);
  }

  addBox(id, width, height, depth) {
    CommandsByName.addBox.params[0] = id;
    CommandsByName.addBox.params[1] = width;
    CommandsByName.addBox.params[2] = height;
    CommandsByName.addBox.params[3] = depth;
    this.post(CommandsByName.addBox);
  }

  addPlane(id) {
    CommandsByName.addPlane.params[0] = id;
    this.post(CommandsByName.addPlane);
  }

  setPhysicsState(id, 
    x, y, z,
    qx, qy, qz, qw,
    dx, dy, dz, 
    adx, ady, adz) {
    CommandsByName.setPhysicsState.params[ 0] = id;
    CommandsByName.setPhysicsState.params[ 1] = x;
    CommandsByName.setPhysicsState.params[ 2] = y;
    CommandsByName.setPhysicsState.params[ 3] = z;
    CommandsByName.setPhysicsState.params[ 4] = qx;
    CommandsByName.setPhysicsState.params[ 5] = qy;
    CommandsByName.setPhysicsState.params[ 6] = qz;
    CommandsByName.setPhysicsState.params[ 7] = qw;
    CommandsByName.setPhysicsState.params[ 8] = dx;
    CommandsByName.setPhysicsState.params[ 9] = dy;
    CommandsByName.setPhysicsState.params[10] = dz;
    CommandsByName.setPhysicsState.params[11] = adx;
    CommandsByName.setPhysicsState.params[12] = ady;
    CommandsByName.setPhysicsState.params[13] = adz;
    this.post(CommandsByName.setPhysicsState);
  }

  setLinearDamping(id, v) {
    CommandsByName.setLinearDamping.params[0] = id;
    CommandsByName.setLinearDamping.params[1] = v;
    this.post(CommandsByName.setLinearDamping);
  }

  setAngularDamping(id, v) {
    CommandsByName.setAngularDamping.params[0] = id;
    CommandsByName.setAngularDamping.params[1] = v;
    this.post(CommandsByName.setAngularDamping);
  }

  addSpring(id1, id2, restLength, stiffness, damping) {
    CommandsByName.addSpring.params[0] = id1;
    CommandsByName.addSpring.params[1] = id2;
    CommandsByName.addSpring.params[2] = restLength;
    CommandsByName.addSpring.params[3] = stiffness;
    CommandsByName.addSpring.params[4] = damping;
    this.post(CommandsByName.addSpring);
  }
}
