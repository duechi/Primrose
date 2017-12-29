import CANNON from "cannon";

import { Commands, checkCommands } from "./Commands";

export default class EngineServer {
  constructor() {

    const reqs = checkCommands(this);
    if(reqs.length > 0) {
      throw new Error(reqs.join("/n"));
    }

    this.physics = new CANNON.World();
    this.bodyIDs = [];
    this.bodyDB = {};
    this.springs = [];
    this.output = [];

    this.physics.broadphase = new CANNON.SAPBroadphase(this.physics);
    this.physics.solver.iterations = 10;

    this.physics.addEventListener("postStep", (evt) => {
      for(let i = 0; i < this.springs.length; ++i) {
        this.springs[i].applyForce();
      }
    });
  }

  update(dt){
    this.physics.step(EngineServer.DT, dt);
  }

  sleepBody(evt) {
    //console.log(this, evt.target);
  }

  getBody(id) {
    const body = this.bodyDB[id];
    if(body.sleepState === CANNON.Body.SLEEPING) {
      body.wakeUp();
    }
    return body;
  }

  addBox(id, width, height, depth) {
    const body = this.getBody(id);
    body.addShape(
      new CANNON.Box(
        new CANNON.Vec3(width, height, depth)));
  }

  addSphere(id, radius) {
    const body = this.getBody(id);
    body.addShape(new CANNON.Sphere(radius));
  }

  addPlane(id) {
    const body = this.getBody(id);
    body.addShape(new CANNON.Plane());
  }

  addSpring(id1, id2, restLength, stiffness, damping) {
    const body1 = this.getBody(id1),
      body2 = this.getBody(id2);
    this.springs.push(new CANNON.Spring(body1, body2, {
      restLength,
      stiffness,
      damping
    }));
  }

  disableAllowSleep() {
    this.physics.allowSleep = false;
  }

  enableAllowSleep() {
    this.physics.allowSleep = true;
  }

  newBody(id, mass, type) {
    const body = new CANNON.Body({
      mass,
      type,
      allowSleep: true,
      sleepSpeedLimit: 0.1,
      sleepTimeLimit: 1
    });
    body.addEventListener("sleep", this.sleepBody.bind(this));
    this.bodyIDs.push(id);
    this.bodyDB[id] = body;
    this.physics.addBody(body);
  }

  setAngularDamping(id, v) {
    const body = this.getBody(id);
    body.angularDamping = v;
  }

  setAngularVelocity(id, x, y, z) {
    const body = this.getBody(id);
    body.angularVelocity.set(x, y, z);
  }

  setGravity(g) {
    this.physics.gravity.set(0, g, 0);
  }

  setLinearDamping(id, v) {
    const body = this.getBody(id);
    body.linearDamping = v;
  }

  setPosition(id, x, y, z) {
    const body = this.getBody(id);
    body.position.set(x, y, z);
  }

  setQuaternion(id, x, y, z, w) {
    const body = this.getBody(id);
    body.quaternion.set(x, y, z, w);
  }

  setVelocity(id, x, y, z) {
    const body = this.getBody(id);
    body.velocity.set(x, y, z);
  }
}

EngineServer.DT = 0.01;
