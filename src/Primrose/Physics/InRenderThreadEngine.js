import CANNON from "cannon";

import BaseEnginePlugin from "./BaseEnginePlugin";

import EngineServer from "./EngineServer";

const data = [],
  evt = { type: "message", data };

export default class InRenderThreadEngine extends BaseEnginePlugin {

  constructor() {
    super();
    this._engine = new EngineServer();
  }

  preUpdate(env, dt) {
    super.preUpdate(env, dt);
    this._engine.update(dt);
    for(let n = 0; n < this._engine.bodyIDs.length; ++n) {
      const id = this._engine.bodyIDs[n],
        body = this._engine.bodyDB[id],
        ent = env.entities.get(id);

      if(body && ent && body.sleepState !== CANNON.Body.SLEEPING) {
        ent.position.copy(body.position);
        ent.quaternion.copy(body.quaternion);
        ent.velocity.copy(body.velocity);
        ent.angularVelocity.copy(body.angularVelocity);
        ent.updateMatrix();
        ent.commit();
      }
    }
  }

  setGravity(v) {
    this._engine.setGravity(v);
  }

  enableAllowSleep() {
    this._engine.enableAllowSleep();
  }

  disableAllowSleep() {
    this._engine.disableAllowSleep();
  }

  newBody(id, mass, type) {
    this._engine.newBody(id, mass, type);
  }

  removeBody(id) {
    this._engine.removeBody(id);
  }

  addSphere(id, radius) {
    this._engine.addSphere(id, radius);
  }

  addBox(id, width, height, depth) {
    this._engine.addBox(id, width, height, depth);
  }

  addPlane(id) {
    this._engine.addPlane(id);
  }

  setPhysicsState(id, 
    x, y, z,
    qx, qy, qz, qw,
    dx, dy, dz, 
    adx, ady, adz) {
    this._engine.setPhysicsState(id, 
      x, y, z,
      qx, qy, qz, qw,
      dx, dy, dz, 
      adx, ady, adz);
  }

  setLinearDamping(id, v) {
    this._engine.setLinearDamping(id, v);
  }

  setAngularDamping(id, v) {
    this._engine.setAngularDamping(id, v);
  }

  addSpring(id1, id2, restLength, stiffness, damping) {
    this._engine.addSpring(id1, id2, restLength, stiffness, damping);
  }
}
