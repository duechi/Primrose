import { EventDispatcher, Object3D } from "three";


/*
pliny.method({
  parent: "THREE.Object3D",
  name: "emit",
  description: "Creates a new Event object to fire through `dispatchEvent`.",
  parameters: [{
    name: "evt",
    type: "String",
    description: "The type of the event to fire."
  }, {
    name: "obj",
    type: "Object",
    description: "Additional information to include in the event.",
    optional: true
  }]
});

pliny.method({
  parent: "THREE.EventDispatcher",
  name: "emit",
  description: "Creates a new Event object to fire through `dispatchEvent`.",
  parameters: [{
    name: "evt",
    type: "String",
    description: "The type of the event to fire."
  }, {
    name: "obj",
    type: "Object",
    description: "Additional information to include in the event.",
    optional: true
  }]
});
*/
Object3D.prototype.emit = EventDispatcher.prototype.emit = function(evt, obj) {
  if(!obj) {
    obj = {};
  }

  if(typeof obj === "object" && !(obj instanceof Event)){
    obj.type = evt;

    if(obj.defaultPrevented === undefined){
      obj.defaultPrevented = false;
      obj.preventDefault = () => obj.defaultPrevented = true;
    }
  }

  this.dispatchEvent(obj);
};


/*
pliny.method({
  parent: "THREE.Object3D",
  name: "dispatchEvent",
  description: "Fire any listeners for the type of the given event.",
  parameters: [{
    name: "evt",
    type: "Object",
    description: "Either a native event or an ersatz event object. The listeners that get fired are determined by `evt.type`. Fixes a bug in Three.js that attempts to modify `evt.target` of even native Event types."
  }]
});

pliny.method({
  parent: "THREE.EventDispatcher",
  name: "dispatchEvent",
  description: "Either a native event or an ersatz event object. The listeners that get fired are determined by `evt.type`. Fixes a bug in Three.js that attempts to modify `evt.target` of even native Event types."
  parameters: [{
    name: "evt",
    type: "Object",
    description: "Either a native event or an ersatz event object. The listeners that get fired are determined by `evt.type`."
  }]
});
*/
Object3D.prototype.dispatchEvent = EventDispatcher.prototype.dispatchEvent = function(evt) {
  if (this._listeners === undefined ){
    return;
  }

  var listeners = this._listeners;
  var listenerArray = listeners[ evt.type ];

  if ( listenerArray !== undefined ) {

    if(!(evt instanceof Event)) {
      evt.target = this;
    }

    var array = [], i = 0;
    var length = listenerArray.length;

    for ( i = 0; i < length; i ++ ) {

      array[ i ] = listenerArray[ i ];

    }

    for ( i = 0; i < length; i ++ ) {

      array[ i ].call( this, evt );

    }

  }
};


/*

pliny.method({
  parent: "THREE.Object3D",
  name: "watch",
  returns: "THREE.Object3D",
  description: "Listens to a list of events on a child object, and re-emits them from this object. Returns itself to enable method chaining.",
  parameters: [{
    name: "child",
    type: "THREE.EventDispatcher",
    description: "The object to watch."
  }, {
    name: "events",
    type: "Array",
    description: "An array of Strings naming event types to watch."
  }]
});

pliny.method({
  parent: "THREE.EventDispatcher",
  name: "watch",
  returns: "THREE.EventDispatcher",
  description: "Listens to a list of events on a child object, and re-emits them from this object. Returns itself to enable method chaining.",
  parameters: [{
    name: "child",
    type: "THREE.EventDispatcher",
    description: "The object to watch."
  }, {
    name: "events",
    type: "Array",
    description: "An array of Strings naming event types to watch."
  }]
});
*/
Object3D.prototype.watch = EventDispatcher.prototype.watch = function(child, events) {
  if(!(events instanceof Array)) {
    events = [events];
  }
  events.forEach((event) =>
    child.addEventListener(event, this.dispatchEvent.bind(this)));
  return this;
};


/*
pliny.method({
  parent: "THREE.Object3D",
  name: "route",
  returns: "THREE.Object3D",
  description: "Adds a single event listener to a list of events.",
  parameters: [{
    name: "events",
    type: "Array",
    description: "An array of Strings naming the event types to watch"
  }, {
    name: "listener",
    type: "Function",
    description: "The callback function to invoke when the events are fired."
  }]
});

pliny.method({
  parent: "THREE.EventDispatcher",
  name: "route",
  returns: "THREE.EventDispatcher",
  description: "Adds a single event listener to a list of events.",
  parameters: [{
    name: "events",
    type: "Array",
    description: "An array of Strings naming the event types to watch"
  }, {
    name: "listener",
    type: "Function",
    description: "The callback function to invoke when the events are fired."
  }]
});
*/
Object3D.prototype.route = EventDispatcher.prototype.route = function(events, listener) {
  events.forEach((event) =>
    this.addEventListener(event, listener));
  return this;
};


/*
pliny.method({
  parent: "THREE.Object3D",
  name: "on",
  returns: "THREE.Object3D",
  description: "An alias for `addEventListener` that returns itself to enable method chaining.",
  parameters: [{
    name: "event",
    type: "String",
    description: "The name of the event type for which to add a listener."
  }, {
    name: "listener",
    type: "Function",
    description: "The callback function to invoke when the event is fired."
  }]
});

pliny.method({
  parent: "THREE.EventDispatcher",
  name: "on",
  returns: "THREE.EventDispatcher",
  description: "An alias for `addEventListener` that returns itself to enable method chaining.",
  parameters: [{
    name: "event",
    type: "String",
    description: "The name of the event type for which to add a listener."
  }, {
    name: "listener",
    type: "Function",
    description: "The callback function to invoke when the event is fired."
  }]
});
*/
Object3D.prototype.on = EventDispatcher.prototype.on = function(event, listener) {
  this.addEventListener(event, listener);
  return this;
};

Object3D.prototype.once = EventDispatcher.prototype.once = function(event, listener) {
  const handler = (evt) => {
    listener(evt);
    this.removeEventListener(event, handler);
  };

  this.addEventListener(event, handler);
}