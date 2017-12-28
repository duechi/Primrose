import { Vector3, Quaternion } from "three";

import { coalesce } from "../util";

import { Entity } from "../Primrose/Controls";
import { EntityManager } from "../Primrose/Physics";

const TEMP = new Vector3(),
  Q = new Quaternion();

Q.setFromUnitVectors(
  new Vector3(0, 0, 1),
  new Vector3(0, 1, 0));

/*
pliny.function({
  parent: "Live API",
  name: "phys",
  description: "Make a 3D object react to physics updates.",
  returns: "Primrose.Controls.Entity",
  parameters: [{
    name: "obj",
    type: "THREE.Mesh",
    description: "The object to which to add physics capability."
  }, {
    name: "options",
    type: "Live API.phys.optionsHash",
    description: "Optional settings for creating the physics settings."
  }]
});

pliny.record({
  parent: "Live API.phys",
  name: "optionsHash",
  type: "Object",
  description: "A record holding options for the `phys` function. Extends CANNON.Body's constructor options.",
  link: "http://schteppe.github.io/cannon.js/docs/classes/Body.html",
  parameters: []
});
*/
export default function phys(obj, options) {

  options = coalesce({}, options);

  let ent = null;
  if(obj.isEntity) {
    ent = obj;
  }
  else {
    ent = new Entity(obj.name, options);
    obj.name = "";
    ent.mesh = obj;
    ent.add(obj);
    ent.position.copy(obj.position);
    ent.quaternion.copy(obj.quaternion);
    obj.position.set(0, 0, 0);
    obj.quaternion.set(0, 0, 0, 1);
  }


  if(!ent.physMapped) {

    ent.newBody(options);

    let head = ent;
    while(head && !head.geometry && head.children.length > 0) {
      head = head.children[0];
    }

    if(head.geometry){

      const g = head.geometry;
      g.computeBoundingSphere();
      g.computeBoundingBox();
      g.boundingBox.getSize(TEMP);

      const { x, y, z } = TEMP,
        r = g.boundingSphere.radius,
        volSphere = Math.PI * r * r,
        volBox = x * y * z;

      if(volSphere < volBox) {
        ent.addSphere(r);
      }
      else if(volBox === 0) {
        ent.addPlane();
        ent.quat(Q.x, Q.y, Q.z, Q.w);
      }
      else {
        ent.addBox(0.5 * x, 0.5 * y, 0.5 * z);
      }
    }
  }

  return ent;
}
