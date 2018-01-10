import CANNON from "cannon";

import { checkCommands } from "./Commands";

export default class EngineServer {
  constructor() {

    const reqs = checkCommands(this);
    if(reqs.length > 0) {
      throw new Error(reqs.join("\n"));
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
    if(!body) {
      console.log("don't have", id, this.bodyIDs);
    }
    else if(body.sleepState === CANNON.Body.SLEEPING) {
      body.wakeUp();
    }
    return body;
  }

  addBox(id, width, height, depth) {
    const body = this.getBody(id);
    if(body) {
      body.addShape(
      new CANNON.Box(
        new CANNON.Vec3(width, height, depth)));
    }
  }

  addSphere(id, radius) {
    const body = this.getBody(id);
    if(body) {
      body.addShape(new CANNON.Sphere(radius));
    }
  }

  addPlane(id) {
    const body = this.getBody(id);
    if(body) {
      body.addShape(new CANNON.Plane());
    }
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

  removeBody(oldID) {
    const oldBodyDB = this.bodyDB,
      oldBodyIDs = this.bodyIDs;

    this.bodyDB = {};
    this.bodyIDs = [];

    for(let i = 0; i < oldBodyIDs.length; ++i) {
      const curID = oldBodyIDs[i];
      if(curID < oldID) {
        this.bodyDB[curID] = oldBodyDB[curID];
        this.bodyIDs.push(curID);
      }
      else if(curID > oldID) {
        this.bodyDB[curID - 1] = oldBodyDB[curID];
        this.bodyIDs.push(curID - 1);
      }
      else {
        this.physics.removeBody(oldBodyDB[curID]);
      }
    }
  }

  setAngularDamping(id, v) {
    const body = this.getBody(id);
    if(body) {
      body.angularDamping = v;
    }
  }

  setGravity(g) {
    this.physics.gravity.set(0, g, 0);
  }

  setLinearDamping(id, v) {
    const body = this.getBody(id);
    if(body) {
      body.linearDamping = v;
    }
  }

  setPhysicsState(id,
    x, y, z,
    qx, qy, qz, qw,
    dx, dy, dz,
    adx, ady, adz) {
    const body = this.getBody(id);
    if(body) {
      body.position.set(x, y, z);
      body.quaternion.set(qx, qy, qz, qw);
      body.velocity.set(dx, dy, dz);
      body.angularVelocity.set(adx, ady, adz);
    }
  }
}

EngineServer.DT = 0.01;
