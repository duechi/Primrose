/*
pliny.class({
  parent: "Primrose.Physics",
  name: "DirectedForceField",
  description: "A component that causes two objects (the object to which the DirectedForceField is added as a component and one other object) to repel or attract each other with a set force.",
  parameters: [{
    name: "bodyStart",
    type: "THREE.Object3D",
    description: "An entity that has a rigid body component that we can manipulate for the physics system."
  }, {
    name: "bodyEnd",
    type: "THREE.Object3D",
    description: "An entity that has a rigid body component that we can manipulate for the physics system."
  }, {
    name: "options",
    type: "Object",
    optional: true,
    description: "Optional configuration values. See following parameters:"
  }, {
    name: "options.force",
    type: "Number",
    optional: true,
    default: 1,
    description: "The force to attract the two objects together. Use negative values to repel objects. If `gravitational` is true, the force will be a value for the gravitational constant G in the two-body gravity equation. The real value of G is available as `Primrose.Constants.G."
  }, {
    name: "options.gravitational",
    type: "Boolean",
    optional: true,
    default: false,
    description: "Indicate whether or not to treat the force as gravity, i.e. taking mass into consideration. If `gravitational` is true, the force will be a value for the gravitational constant G in the two-body gravity equation. The real value of G is available as `Primrose.Constants.G."
  }, {
    name: "options.falloff",
    type: "Boolean",
    optional: true,
    default: true,
    description: "Indicate whether or not to use a distance-squared fall-off for the force. If `gravitational` is specified, the fall-off is always distance-squared, regardless of setting this value."
  }]
});
*/

import CANNON from "cannon";

import { coalesce } from "../../util";


const TEMP = new CANNON.Vec3();

export default class DirectedForceField {
  constructor(bodyStart, bodyEnd, options) {
    this.bodyStart = bodyStart;
    this.bodyEnd = bodyEnd;

    options = coalesce({
      force: 1,
      gravitational: false,
      falloff: true
    }, options);

    /*
    pliny.property({
      parent: "Primrose.Physics.DirectedForceField",
      name: "force",
      type: "Number",
      description: "The force to attract the two objects together. Use negative values to repel objects. If `gravitational` is true, the force will be a value for the gravitational constant G in the two-body gravity equation. The real value of G is available as `Primrose.Constants.G."
    });
    */
    this.force = options.force;

    /*
    pliny.property({
      parent: "Primrose.Physics.DirectedForceField",
      name: "gravitational",
      type: "Boolean",
      description: "Indicate whether or not to treat the force as gravity, i.e. taking mass into consideration. If `gravitational` is true, the force will be a value for the gravitational constant G in the two-body gravity equation. The real value of G is available as `Primrose.Constants.G."
    });
    */
    this.gravitational = options.gravitational;

    /*
    pliny.property({
      parent: "Primrose.Physics.DirectedForceField",
      name: "falloff",
      type: "Boolean",
      description: "Indicate whether or not to use a distance-squared fall-off for the force. If `gravitational` is specified, the fall-off is always distance-squared, regardless of setting this value."
    });
    */
    this.falloff = options.falloff;
  }

  applyForce() {
    this.bodyStart.position.vsub(this.bodyEnd.position, TEMP);
    let d = TEMP.length(),
      f = this.force;
    if(this.gravitational) {
      f *= this.bodyEnd.mass * this.bodyStart.mass;
    }
    if(this.gravitational || this.falloff) {
      // the distance is cubed so it both normalizes the displacement vector
      // `TEMP` at the same time as computes the distance-squared fall-off.
      d *= d * d;
    }
    TEMP.mult(f / d, TEMP);
    this.bodyStart.force.vadd(TEMP, this.bodyStart.force);
    TEMP.negate(TEMP);
    this.bodyEnd.force.vadd(TEMP, this.bodyEnd.force);
  }
}
