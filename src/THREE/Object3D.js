import { Object3D } from "three";


/*
pliny.property({
  parent: "THREE.Object3D",
  name: "pickable",
  type: "Boolean",
  description: "Returns true if the current object has any event listeners attached to it that represent picking operations."
});
*/
Object.defineProperty(Object3D.prototype, "pickable", {
  get: function() {
    const l = this._listeners;
    return l && (
         (l.enter && l.enter.length > 0)
      || (l.exit && l.exit.length > 0)
      || (l.select && l.select.length > 0)
      || (l.useraction && l.useraction.length > 0)
      || (l.pointerstart && l.pointerstart.length > 0)
      || (l.pointerend && l.pointerend.length > 0)
      || (l.pointermove && l.pointermove.length > 0)
      || (l.gazestart && l.gazestart.length > 0)
      || (l.gazecancel && l.gazecancel.length > 0)
      || (l.gazemove && l.gazemove.length > 0)
      || (l.gazecomplete && l.gazecomplete.length > 0));
  }
});


/*
pliny.property({
  parent: "THREE.Object3D",
  name: "visible",
  type: "Boolean",
  description: "Returns true if the current object has been set to be visible. When setting `visible`, emits a `visiblechanged` event if the new value is different from the old value."
});
*/
Object.defineProperty(Object3D.prototype, "visible", {
  get: function() {
    return this._visible;
  },
  set: function(v) {
    var oldV = this._visible;
    this._visible = v;
    if(oldV !== v){
      this.emit("visiblechanged");
    }
  }
});


/*
pliny.method({
  parent: "THREE.Object3D",
  name: "appendChild",
  returns: "THREE.Object3D",
  description: "An alias for `Object3D::add`, to mirror DOM. Returns itself to enable method chaining.",
  parameters: [ {
    name: "child",
    type: "THREE.Object3D",
    description: "The object to add."
  }]
});
*/
Object3D.prototype.appendChild = function(child) {
  return this.add(child);
};


/*
pliny.method({
  parent: "THREE.Object3D",
  name: "latLng",
  returns: "THREE.Object3D",
  description: "Positions this object at a set radius, latitude, and longitude away from the origin. Returns itself to enable method chaining.",
  parameters: [{
    name: "lat",
    type: "Number",
    description: "The latitude angle at which to set the object",
    optional: true,
    defaultValue: 0
  }, {
    name: "lng",
    type: "Number",
    description: "The longitude angle at which to set the object",
    optional: true,
    defaultValue: 0
  }. {
    name: "r",
    type: "Number",
    description: "The radius at which to set the object",
    optional: true,
    defaultValue: 1.5
  }]
});
*/
Object3D.prototype.latLng = function(lat, lng, r) {
  lat = -Math.PI * (lat || 0) / 180;
  lng = Math.PI * (lng || 0) / 180;
  r = r || 1.5;
  this.rotation.set(lat, lng, 0, "XYZ");
  this.position.set(0, 0, -r);
  this.position.applyQuaternion(this.quaternion);
  return this;
};


/*
pliny.method({
  parent: "THREE.Object3D",
  name: "named",
  returns: "THREE.Object3D",
  description: "Sets the name of the object. Returns itself to enable method chaining.",
  parameters: [{
    name: "name",
    type: "String",
    description: "A name for easier debugging."
  }]
});
*/
Object3D.prototype.named = function(name){
  this.name = name;
  return this;
};


/*
pliny.method({
  parent: "THREE.Object3D",
  name: "addTo",
  returns: "THREE.Object3D",
  description: "Adds this object to another object, the reverse relationship of `obj.add(this)`. Returns itself to enable method chaining.",
  parameters: [{
    name: "obj",
    type: "THREE.Object3D",
    description: "The object to which to add this object."
  }]
});
*/
Object3D.prototype.addTo = function(obj) {
  obj.add(this);
  return this;
};


/*
pliny.method({
  parent: "THREE.Object3D",
  name: "at",
  returns: "THREE.Object3D",
  description: "Sets the position of the object. Returns itself to enable method chaining.",
  parameters: [{
    name: "x",
    type: "Number",
    description: "The X-axis position."
  }, {
    name: "y",
    type: "Number",
    description: "The Y-axis position."
  }, {
    name: "z",
    type: "Number",
    description: "The Z-axis position."
  }]
});
*/
Object3D.prototype.at = function(x, y, z) {
  this.position.set(x, y, z);
  return this;
};


/*
pliny.method({
  parent: "THREE.Object3D",
  name: "rot",
  returns: "THREE.Object3D",
  description: "Sets the Euler rotation of the object. Returns itself to enable method chaining.",
  parameters: [{
    name: "x",
    type: "Number",
    description: "The X-axis rotation."
  }, {
    name: "y",
    type: "Number",
    description: "The Y-axis rotation."
  }, {
    name: "z",
    type: "Number",
    description: "The Z-axis rotation."
  }]
});
*/
Object3D.prototype.rot = function(x, y, z) {
  this.rotation.set(x, y, z);
  return this;
};


/*
pliny.method({
  parent: "THREE.Object3D",
  name: "scl",
  returns: "THREE.Object3D",
  description: "Sets the scale of the object. Returns itself to enable method chaining.",
  parameters: [{
    name: "x",
    type: "Number",
    description: "The X-axis scale."
  }, {
    name: "y",
    type: "Number",
    description: "The Y-axis scale."
  }, {
    name: "z",
    type: "Number",
    description: "The Z-axis scale."
  }]
});
*/
Object3D.prototype.scl = function(x, y, z) {
  this.scale.set(x, y, z);
  return this;
};
