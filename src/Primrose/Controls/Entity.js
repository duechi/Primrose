/*
pliny.class({
  parent: "Primrose.Physics",
  baseClass: "Primrose.BasePlugin",
  name: "EnginePlugin",
  description: "Installs a physics subsystem, based on CANNON.js.",
  parameters: [{
    name: "options",
    type: "Primrose.Physics.EnginePlugin.optionsHash",
    description: "Options for creating the shadow map"
  }]
});

pliny.record({
  parent: "Primrose.Physics.EnginePlugin",
  name: "optionsHash",
  parameters: [{
    name: "gravity",
    type: "Number",
    optional: true,
    default: 9.8,
    description: "The acceleration applied to falling objects."
  }]
});
*/
/*
pliny.class({
  parent: "Primrose.Controls",
  name: "Entity",
  baseClass: "THREE.Object3D",
  description: "The Entity class is the parent class for all 3D controls. It manages a unique ID for every new control, the focus state of the control, and performs basic conversions from DOM elements to the internal Control format."
});
*/

import { 
  Object3D, 
  Euler, 
  Quaternion, 
  Vector3
} from "three";

import { EntityManager } from "../Physics";

const TEMP_EULER = new Euler(),
  TEMP_QUAT = new Quaternion();

export default class Entity extends Object3D {

  constructor(name, options) {
    super();
    this.isEntity = true;
    
    this.name = name;
    
    this.options = options || {};
    
    this.disabled = false;
    
    this.mesh = null;
    
    this.physMapped = false;
    
    this.velocity = new Vector3();
    this.angularVelocity = new Vector3();
    this.linearDamping = 0;
    this.angularDamping = 0;
    this.commands = [];
    
    this._lastPosition = new Vector3();
    this._lastQuaternion = new Quaternion();
    this._lastVelocity = new Vector3();
    this._lastAngularVelocity = new Vector3();
    this._lastLinearDamping = 0;
    this._lastAngularDamping = 0;

    this.ready = this.load().then(() => {
      EntityManager.entities.push(this);
      EntityManager.entityDB[this.uuid] = this;
      return this;
    });
  }

  recv(arr, i) {
    this.position.fromArray(arr, i + 1);
    this.quaternion.fromArray(arr, i + 4);
    this.velocity.fromArray(arr, i + 8);
    this.angularVelocity.fromArray(arr, i + 11);
    this.updateMatrix();

    this._lastPosition.copy(this.position);
    this._lastQuaternion.copy(this.quaternion);
    this._lastVelocity.copy(this.velocity);
    this._lastAngularVelocity.copy(this.angularVelocity);
    return i + 14;
  }

  load() {
    return Promise.resolve();
  }

  update() {

  }

  at(x, y, z) {
    this.position.set(x, y, z);
    return this;
  }

  quat(x, y, z, w) {
    this.quaternion.set(x, y, z, w);
    return this;
  }

  rot(x, y, z) {
    TEMP_EULER.set(x, y, z);
    TEMP_QUAT.setFromEuler(TEMP_EULER);
    return this.quat(TEMP_QUAT.x, TEMP_QUAT.y, TEMP_QUAT.z, TEMP_QUAT.w);
  }

  vel(x, y, z) {
    this.velocity.set(x, y, z);
    return this;
  }

  spin(x, y, z) {
    this.angularVelocity.set(x, y, z);
    return this;
  }

  drag(v) {
    this.linearDamping = v;
    return this;
  }

  angularDrag(v) {
    this.angularDamping = v;
    return this;
  }

  newBody(options) {
    this.physMapped = true;
    this.commands.push(["newBody", this.uuid, options.mass, options.type]);
  }

  addSphere(r) {
    this.commands.push(["addSphere", this.uuid, r]);
  }

  addPlane() {
    this.commands.push(["addPlane", this.uuid]);
  }

  addBox(w, h, d) {
    this.commands.push(["addBox", this.uuid, w, h, d]);
  }

  spring(b, options) {
    if(this.physMapped && b.physMapped) {
      this.commands.push(["spring", 
        this.uuid,
        b.uuid,
        options.restLength,
        options.stiffness,
        options.damping]);
    }
    else {
      console.warn("Missing physics objects [A, B]: ", this.physMapped, b.physMapped);
    }
    return this;
  }
};
