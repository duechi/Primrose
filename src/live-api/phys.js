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

  options = coalesce({
    type: 1,
    shape: "auto"
  }, options);

  let ent = null;
  if(obj.isEntity) {
    ent = obj;
  }
  else {
    ent = new Entity(obj.name + "Entity", options);
    ent.mesh = obj;
    ent.add(obj);
    ent.position.copy(obj.position);
    ent.quaternion.copy(obj.quaternion);
    obj.position.set(0, 0, 0);
    obj.quaternion.set(0, 0, 0, 1);
  }


  if(!ent.physMapped) {

    ent.physMapped = true;
    ent.commands.push(["newBody", options.mass, options.type]);

    let head = ent;
    while(head && !head.geometry && head.children.length > 0) {
      head = head.children[0];
    }

    if(head.geometry) {

      const g = head.geometry;

      if(options.shape === "trimesh") {
        ent.commands.push(["startMesh"]);

        if(g.isBufferGeometry) {
          const position = g.attributes.position.array,
            index = g.index;

          for(let i = 0; i < position.count; i += 3) {
            ent.commands.push(["addMeshVertex",
              position[i + 0],
              position[i + 1],
              position[i + 2]]);
          }
          for(let i = 0; i < index.count; i += 3) {
            ent.commands.push(["addMeshTriangle",
              index[i + 0],
              index[i + 1],
              index[i + 2]]);
          }
        }
        else {
          const { vertices, faces } = g;

          for(let i = 0; i < vertices.length; ++i) {
            const vertex = vertices[i];
            ent.commands.push(["addMeshVertex",
              vertex.x,
              vertex.y,
              vertex.z]);
          }

          for(let i = 0; i < faces.length; ++i) {
            const face = faces[i];
            ent.commands.push(["addMeshTriangle",
              face.a,
              face.b,
              face.c]);
          }
        }

        ent.commands.push(["finishMesh"]);
      }
      else {
        g.computeBoundingSphere();
        g.computeBoundingBox();
        g.boundingBox.getSize(TEMP);

        const { x: width, y: height, z: depth } = TEMP,
          r = g.boundingSphere.radius;

        if(options.shape === "auto") {
          const volSphere = Math.PI * r * r,
            volBox = width * height * depth;

          if(volBox === 0) {
            options.shape = "plane";
          }
          else if(volSphere < volBox) {
            options.shape = "sphere";
          }
          else {
            options.shape = "box";
          }
        }

        if(options.shape === "plane") {
          ent.commands.push(["addPlane"]);
          ent.quat(Q.x, Q.y, Q.z, Q.w);
        }
        else if(options.shape === "sphere") {
          ent.commands.push(["addSphere", r]);
        }
        else if(options.shape === "box") {
          ent.commands.push(["addBox",
            0.5 * width, 0.5 * height, 0.5 * depth,
            0.5 * width, 0.5 * height, 0.5 * depth]);
        }
      }
    }
  }

  return ent;
}
