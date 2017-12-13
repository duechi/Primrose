import CANNON from "cannon";
import { Vector3 } from "three";

import Entity from "../Primrose/Controls/Entity";


const TEMP = new Vector3();

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
  parameters: [{
    name: "disableAutoShape",
    type: "Boolean",
    description: "Set to true to disable using the Mesh's geometry to estimate a bounding box or sphere.",
    optional: true,
    defaultValue: false
  }]
});
*/
export default function phys(obj, options) {
  options = Object.assign({}, options);

  const ent = new Entity(obj.name, options);
  obj.name = "";
  ent.mesh = obj;
  ent.add(obj);
  ent.rigidBody = new CANNON.Body(options);
  ent.rigidBody.position.copy(obj.position);
  ent.rigidBody.quaternion.copy(obj.quaternion);
  obj.position.set(0, 0, 0);
  obj.quaternion.set(0, 0, 0, 1);

  if(!options.disableAutoShape && obj.geometry){
    const g = obj.geometry;
    g.computeBoundingSphere();
    g.computeBoundingBox();
    g.boundingBox.getSize(TEMP);
    const volSphere = g.boundingSphere.radius * g.boundingSphere.radius * Math.PI,
      volBox = TEMP.x * TEMP.y * TEMP.z;

    if(volSphere < volBox){
      ent.rigidBody.addShape(new CANNON.Sphere(g.boundingSphere.radius));
    }
    else {
      TEMP.multiplyScalar(0.5);
      ent.rigidBody.addShape(new CANNON.Box(new CANNON.Vec3().copy(TEMP)));
    }
  }

  return ent;
}
