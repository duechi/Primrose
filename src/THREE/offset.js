import { Geometry, BufferGeometry } from "three";


/*
pliny.method({
  parent: "THREE.Geometry",
  name: "offset",
  returns: "THREE.Geometry",
  descriptions: "Modifies the geometry, adding a constant offset to each vertex. Returns itself to enable method chaining.",
  parameters: [{
    name: "x",
    type: "Number",
    description: "The offset in the X-axis by which to move the vertices."
  }, {
    name: "y",
    type: "Number",
    description: "The offset in the Y-axis by which to move the vertices."
  }, {
    name: "z",
    type: "Number",
    description: "The offset in the Z-axis by which to move the vertices."
  }]
})
*/
Geometry.prototype.offset = function(x, y, z){
  const arr = this.vertices;
  for(let i = 0; i < arr.length; ++i) {
    const vert = arr[i];
    vert.x += x;
    vert.y += y;
    vert.z += z;
  }
  return this;
};


/*
pliny.method({
  parent: "THREE.BufferGeometry",
  name: "offset",
  returns: "THREE.BufferGeometry",
  descriptions: "Modifies the geometry, adding a constant offset to each vertex. Returns itself to enable method chaining.",
  parameters: [{
    name: "x",
    type: "Number",
    description: "The offset in the X-axis by which to move the vertices."
  }, {
    name: "y",
    type: "Number",
    description: "The offset in the Y-axis by which to move the vertices."
  }, {
    name: "z",
    type: "Number",
    description: "The offset in the Z-axis by which to move the vertices."
  }]
})
*/
BufferGeometry.prototype.offset = function(x, y, z){
  const arr = this.attributes.position.array,
    l = this.attributes.position.itemSize;
  for(let i = 0; i < arr.length; i += l) {
    arr[i] += x;
    arr[i + 1] += y;
    arr[i + 2] += z;
  }
  return this;
};
