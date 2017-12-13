/*
pliny.method({
  parent: "THREE.Geometry",
  name: "center",
  returns: "THREE.Geometry",
  description: "Modifies the geometry so that median of all of the vertices ends up at the origin. Returns the current Geometry object to enable chaining of method calls."
});

pliny.method({
  parent: "THREE.BufferGeometry",
  name: "center",
  returns: "THREE.BufferGeometry",
  description: "Modifies the geometry so that median of all of the vertices ends up at the origin. Returns the current Geometry object to enable chaining of method calls."
});
*/

import { Geometry, BufferGeometry } from "three";

BufferGeometry.prototype.center =
Geometry.prototype.center =
  function centerGeometry() {
    this.computeBoundingBox();
    const b = this.boundingBox,
      dx = (b.max.x + b.min.x) / 2,
      dy = (b.max.y + b.min.y) / 2,
      dz = (b.max.z + b.min.z) / 2;
    return this.offset(-dx, -dy, -dz);
  };
