import CANNON from "cannon";

export default class EngineServer {
  constructor(send) {
    this.send = send;
    this.physics = new CANNON.World();
    this.bodyIDs = [];
    this.bodyDB = {};
    this.springs = [];
    this.output = [];

    this.physics.broadphase = new CANNON.NaiveBroadphase();
    this.physics.solver.iterations = 10;
    this.physics.allowSleep = true;

    this.physics.addEventListener("postStep", (evt) => {
      for(let i = 0; i < this.springs.length; ++i) {
        this.springs[i].applyForce();
      }
    });
  }

  recv(arr) {
    while(arr.length > 0) {
      const end = arr.indexOf("END");
      if(end > 0) {
        const args = arr.splice(0, end),
          name = args.shift(),
          handler = this[name];
        if(handler) {
          handler.apply(this, args);
        }
      }
      else {
        arr.shift();
      }
    }
  }

  update(dt){
    this.physics.step(EngineServer.DT, dt);

    let i = 0;
    for(let n = 0; n < this.bodyIDs.length; ++n) {
      const id = this.bodyIDs[n],
        body = this.bodyDB[id];
      if(body.sleepState !== CANNON.Body.SLEEPING) {
        this.output[i + 0] = id;
        this.output[i + 1] = body.position.x;
        this.output[i + 2] = body.position.y;
        this.output[i + 3] = body.position.z;
        this.output[i + 4] = body.quaternion.x;
        this.output[i + 5] = body.quaternion.y;
        this.output[i + 6] = body.quaternion.z;
        this.output[i + 7] = body.quaternion.w;
        this.output[i + 8] = body.velocity.x;
        this.output[i + 9] = body.velocity.y;
        this.output[i + 10] = body.velocity.z;
        this.output[i + 11] = body.angularVelocity.x;
        this.output[i + 12] = body.angularVelocity.y;
        this.output[i + 13] = body.angularVelocity.z;
        i += 14;
      }
    }

    this.send(this.output);
  }

  gravity(g) {
    console.log("setting gravity to:", g);
    this.physics.gravity.set(0, g, 0);
  }

  sleepBody(evt) {
    console.log(this, evt);
  }

  newBody(id, mass, type) {
    const body = new CANNON.Body({
      mass,
      type,
      allowSleep: true,
      sleepSpeedLimit: 0.1,
      sleepTimeLimit: 1
    });
    body.addEventListener(CANNON.Body.sleepEvent, this.sleepBody);
    this.bodyIDs.push(id);
    this.bodyDB[id] = body;
    this.physics.addBody(body);
  }

  getBody(id) {
    const body = this.bodyDB[id];
    if(!body)  {
      console.error("Don't recognize body", id);
    }
    else {
      if(body.sleepState === CANNON.Body.SLEEPING) {
        body.wakeUp();
      }
      return body;
    }
  }

  addSphere(id, radius) {
    const body = this.getBody(id);
    body.addShape(new CANNON.Sphere(radius));
  }

  addBox(id, width, height, depth) {
    const body = this.getBody(id);
    body.addShape(
      new CANNON.Box(
        new CANNON.Vec3(width, height, depth)));
  }

  addPlane(id) {
    const body = this.getBody(id);
    body.addShape(new CANNON.Plane());
  }

  position(id, x, y, z) {
    const body = this.getBody(id);
    body.position.set(x, y, z);
  }

  quaternion(id, x, y, z, w) {
    const body = this.getBody(id);
    body.quaternion.set(x, y, z, w);
  }

  velocity(id, x, y, z) {
    const body = this.getBody(id);
    body.velocity.set(x, y, z);
  }

  angularVelocity(id, x, y, z) {
    const body = this.getBody(id);
    body.angularVelocity.set(x, y, z);
  }

  linearDamping(id, v) {
    const body = this.getBody(id);
    body.linearDamping = v;
  }

  angularDamping(id, v) {
    const body = this.getBody(id);
    body.angularDamping = v;
  }

  spring(id1, id2, restLength, stiffness, damping) {
    const body1 = this.getBody(id1),
      body2 = this.getBody(id2);
    this.springs.push(new CANNON.Spring(bodyA, bodyB, {
      restLength,
      stiffness,
      damping
    }));
  }
}

EngineServer.DT = 0.01;
