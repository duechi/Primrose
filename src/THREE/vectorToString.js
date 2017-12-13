import { Euler, Quaternion, Vector2, Vector3, Vector4, Matrix3, Matrix4 } from "three";

/*
pliny.method({
  parent: "THREE.Euler",
  name: "toString",
  returns: "String",
  description: "Prints a debugging log of the Euler rotation.",
  parameters: [{
    name: "digits",
    type: "Number",
    description: "The number of significant digits to print per element.",
    optional: true,
    defaultValue: 10
  }]
});

pliny.method({
  parent: "THREE.Quaternion",
  name: "toString",
  returns: "String",
  description: "Prints a debugging log of the Quaternion rotation.",
  parameters: [{
    name: "digits",
    type: "Number",
    description: "The number of significant digits to print per element.",
    optional: true,
    defaultValue: 10
  }]
});

pliny.method({
  parent: "THREE.Vector2",
  name: "toString",
  returns: "String",
  description: "Prints a debugging log of the vector.",
  parameters: [{
    name: "digits",
    type: "Number",
    description: "The number of significant digits to print per element.",
    optional: true,
    defaultValue: 10
  }]
});

pliny.method({
  parent: "THREE.Vector3",
  name: "toString",
  returns: "String",
  description: "Prints a debugging log of the vector.",
  parameters: [{
    name: "digits",
    type: "Number",
    description: "The number of significant digits to print per element.",
    optional: true,
    defaultValue: 10
  }]
});

pliny.method({
  parent: "THREE.Vector4",
  name: "toString",
  returns: "String",
  description: "Prints a debugging log of the vector.",
  parameters: [{
    name: "digits",
    type: "Number",
    description: "The number of significant digits to print per element.",
    optional: true,
    defaultValue: 10
  }]
});
*/
Euler.prototype.toString =
Quaternion.prototype.toString =
Vector2.prototype.toString =
Vector3.prototype.toString =
Vector4.prototype.toString =
  function(digits) {
    if(digits === undefined){
      digits = 10;
    }
    var parts = this.toArray();
    for (var i = 0; i < parts.length; ++i) {
      if (parts[i] !== null && parts[i] !== undefined) {
        parts[i] = parts[i].toFixed(digits);
      }
      else {
        parts[i] = "undefined";
      }
    }
    return "<" + parts.join(", ") + ">";
  };

/*
pliny.method({
  parent: "THREE.Euler",
  name: "debug",
  returns: "THREE.Euler",
  description: "Prints a stringified version of the Euler, if the value has changed since the last debug call.",
  parameters: [{
    name: "label",
    type: "String",
    description: "A label to prefix to the output, to differentiate between different object states."
  }, {
    name: "digits",
    type: "Number",
    description: "The number of significant digits to print per element.",
    optional: true,
    defaultValue: 10
  }]
});

pliny.method({
  parent: "THREE.Quaternion",
  name: "debug",
  returns: "THREE.Quaternion",
  description: "Prints a stringified version of the Quaternion, if the value has changed since the last debug call.",
  parameters: [{
    name: "label",
    type: "String",
    description: "A label to prefix to the output, to differentiate between different object states."
  }, {
    name: "digits",
    type: "Number",
    description: "The number of significant digits to print per element.",
    optional: true,
    defaultValue: 10
  }]
});

pliny.method({
  parent: "THREE.Vector2",
  name: "debug",
  returns: "THREE.Vector2",
  description: "Prints a stringified version of the Vector2, if the value has changed since the last debug call.",
  parameters: [{
    name: "label",
    type: "String",
    description: "A label to prefix to the output, to differentiate between different object states."
  }, {
    name: "digits",
    type: "Number",
    description: "The number of significant digits to print per element.",
    optional: true,
    defaultValue: 10
  }]
});

pliny.method({
  parent: "THREE.Vector3",
  name: "debug",
  returns: "THREE.Vector3",
  description: "Prints a stringified version of the Vector3, if the value has changed since the last debug call.",
  parameters: [{
    name: "label",
    type: "String",
    description: "A label to prefix to the output, to differentiate between different object states."
  }, {
    name: "digits",
    type: "Number",
    description: "The number of significant digits to print per element.",
    optional: true,
    defaultValue: 10
  }]
});

pliny.method({
  parent: "THREE.Vector4",
  name: "debug",
  returns: "THREE.Vector4",
  description: "Prints a stringified version of the Vector4, if the value has changed since the last debug call.",
  parameters: [{
    name: "label",
    type: "String",
    description: "A label to prefix to the output, to differentiate between different object states."
  }, {
    name: "digits",
    type: "Number",
    description: "The number of significant digits to print per element.",
    optional: true,
    defaultValue: 10
  }]
});

pliny.method({
  parent: "THREE.Matrix4",
  name: "debug",
  returns: "THREE.Matrix4",
  description: "Prints a stringified version of the Matrix4, if the value has changed since the last debug call.",
  parameters: [{
    name: "label",
    type: "String",
    description: "A label to prefix to the output, to differentiate between different object states."
  }, {
    name: "digits",
    type: "Number",
    description: "The number of significant digits to print per element.",
    optional: true,
    defaultValue: 10
  }]
});
*/
const debugOutputCache = {};
Euler.prototype.debug =
Quaternion.prototype.debug =
Vector2.prototype.debug =
Vector3.prototype.debug =
Vector4.prototype.debug =
Matrix3.prototype.debug =
Matrix4.prototype.debug =
  function(label, digits) {
    var val = this.toString(digits);
    if (val !== debugOutputCache[label]) {
      debugOutputCache[label] = val;
      console.trace(label + "\n" + val);
    }
    return this;
  };
