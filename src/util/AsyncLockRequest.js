/*
pliny.class({
  parent: "Util",
  name: "AsyncLockRequest",
  description: "Searches a set of properties from a list of potential browser-vendor-prefixed options for a set of related functions that can be used to make certain types of Full Screen and Orientation Locking requests.",
  parameters: [{
    name: "name ",
    type: "String",
    description: "A friendly name to use in error messages emitted by this locking object."
  }, {
    name: "elementOpts",
    type: "Array",
    description: "An array of potential element names to search the document object that indicate to which DOM element the lock has been acquired."
  }, {
    name: "changeEventOpts",
    type: "Array",
    description: "An array of potential event names for the callback when the lock is acquired."
  }, {
    name: "errorEventOpts",
    type: "Array",
    description: "An array of potential event names for the callback when the lock has failed to be acquired."
  }, {
    name: "requestMethodOpts",
    type: "Array",
    description: "An array of potential method names for initiating the lock request."
  }, {
    name: "exitMethodOpts",
    type: "Array",
    description: "An array of potential method names for canceling the lock."
  }]
});
*/

import findProperty from "./findProperty";
import immutable from "./immutable";

export default class AsyncLockRequest {
  constructor(name, elementOpts, changeEventOpts, errorEventOpts, requestMethodOpts, exitMethodOpts) {

    /*
    pliny.property({
      parent: "Util.AsyncLockRequest",
      name: "name",
      type: "String",
      description: "The name of the lock requesting object, reflecting what type of lock it will achieve."
    })
    */
    this.name = name;

    this._elementName = findProperty(document, elementOpts);
    this._requestMethodName = findProperty(document.documentElement, requestMethodOpts);
    this._exitMethodName = findProperty(document, exitMethodOpts);
    this._changeTimeout = null;

    this._changeEventName = findProperty(document, changeEventOpts);
    this._errorEventName = findProperty(document, errorEventOpts);
    this._changeEventName = this._changeEventName && this._changeEventName.substring(2);
    this._errorEventName = this._errorEventName && this._errorEventName.substring(2);

    this._events = {
      change: () => this._changeEventName,
      error: () => this._errorEventName
    };

    this.exit = this.exit.bind(this);
    this.request = this.request.bind(this);

    /*
    pliny.property({
      parent: "Util.AsyncLockRequest",
      name: "available",
      type: "Boolean",
      description: "Returns true if the system actually supports the requested locking API."
    })
    */
    this.available = immutable(!!this._requestMethodName);

    if(!this.available) {
      const lowerName = name.toLocaleLowerCase();
      console.log(`Mocking ${name} API`);

      this._elementName = `mock${name}Element`;
      this._changeEventName = `mock${lowerName}change`;
      this._errorEventName = `mock${lowerName}error`;
      this._requestMethodName = `mockRequest${name}`;
      this._exitMethodName = `mockExit${name}`;

      // The locking APIs spec says the property should be `null` when not locked,
      // not `undefined`.
      document[this._elementName] = null;

      // Mock out the request process. We have to use the `self` pattern because
      // we need to use the Element's `this` to set "locked element" property of
      // the document.
      const self = this;
      Element.prototype[this._requestMethodName] = function() {
        self._onRequest();
        // We kick out to a timeout so the rest of the processing from AsyncLockRequest
        // can take place and AsyncLockRequest can follow through.
        setTimeout(() => {
          // Recording which element is actively in the the pointer lock state.
          document[self._elementName] = this;
          self._preDispatchChangeEvent();
          // Say we succeeded, even though we didn't really.
          document.dispatchEvent(new Event(self._changeEventName));
        });
      };

      // Mock out the exit process.
      document[this._exitMethodName] = () => {
        // We never actually succeeded in the first place, so just undo the state
        // changes we made when we lied in the first place.
        document[this._elementName] = null;
        document.dispatchEvent(new Event(this._changeEventName));
      };

      // Enable using the escape key to exit the lock.
      window.addEventListener("keydown", (evt) => {
        if(evt.keyCode === 27) {
          this.exit();
        }
      });

      this.addChangeListener(() => {
        console.info(`(MOCK) The ${name} ${this.isActive ? "is" : "is not"} active.`);
      });
    }
  }

  _onRequest() {}
  _preDispatchChangeEvent() {}

  /*
  pliny.property({
    parent: "Util.AsyncLockRequest",
    name: "element",
    type: "Element",
    description: "The DOM element on which the lock is currently held, or `null` if the lock is not currently active."
  });
  */
  get element(){
    return document[this._elementName];
  }

  /*
  pliny.property({
    parent: "Util.AsyncLockRequest",
    name: "isActive",
    type: "Boolean",
    description: "Returns true when the lock is active on an element in the document."
  });
  */
  get isActive(){
    return !!this.element;
  }

  /*
  pliny.method({
    parent: "Util.AsyncLockRequest",
    name: "addEventListener",
    description: "Find the browser-specific name for a standard event name and add an event listener to the document for it.",
    parameters: [{
      name: "name",
      type: "String",
      description: "The name of the event as it should be in the standard implementation, sans browser prefix."
    }, {
      name: "thunk",
      type: "Function",
      description: "The callback function to invoke when the event occurs."
    }, {
      name: "bubbles",
      type: "Boolean",
      description: "Whether or not the event should be captured before any other event handlers."
    }]
  });
  */
  addEventListener(name, thunk, bubbles){
    const eventName = this._events[name]();
    if(eventName) {
      document.addEventListener(eventName, thunk, bubbles);
    }
  }

  /*
  pliny.method({
    parent: "Util.AsyncLockRequest",
    name: "removeEventListener",
    description: "Find the browser-specific name for a standard event name and remove an event listener from the document for it.",
    parameters: [{
      name: "name",
      type: "String",
      description: "The name of the event as it should be in the standard implementation, sans browser prefix."
    }, {
      name: "thunk",
      type: "Function",
      description: "The callback function to remove from the event listener chain."
    }]
  });
  */
  removeEventListener(name, thunk){
    const eventName = this._events[name]();
    if(eventName) {
      document.removeEventListener(eventName, thunk);
    }
  };

  /*
  pliny.method({
    parent: "Util.AsyncLockRequest",
    name: "addChangeListener",
    description: "Find the browser-specific name for the standard change event and add an event listener to the document for it.",
    parameters: [{
      name: "thunk",
      type: "Function",
      description: "The callback function to invoke when the event occurs."
    }]
  });
  */
  addChangeListener (thunk, bubbles) {
    this.addEventListener("change", thunk, bubbles);
  }

  /*
  pliny.method({
    parent: "Util.AsyncLockRequest",
    name: "removeEventListener",
    description: "Find the browser-specific name for the standard change event and remove an event listener from the document for it.",
    parameters: [{
      name: "thunk",
      type: "Function",
      description: "The callback function to remove from the event listener chain."
    }]
  });
  */
  removeChangeListener(thunk){
    this.removeEventListener("change", thunk);
  }

  /*
  pliny.method({
    parent: "Util.AsyncLockRequest",
    name: "addEventListener",
    description: "Find the browser-specific name for the standard error event and add an event listener to the document for it.",
    parameters: [{
      name: "thunk",
      type: "Function",
      description: "The callback function to invoke when the event occurs."
    }, {
      name: "bubbles",
      type: "Boolean",
      description: "Whether or not the event should be captured before any other event handlers."
    }]
  });
  */
  addErrorListener(thunk, bubbles) {
    this.addEventListener("error", thunk, bubbles);
  }

  /*
  pliny.method({
    parent: "Util.AsyncLockRequest",
    name: "removeEventListener",
    description: "Find the browser-specific name for the standard error event and remove an event listener from the document for it.",
    parameters: [{
      name: "thunk",
      type: "Function",
      description: "The callback function to remove from the event listener chain."
    }]
  });
  */
  removeErrorListener(thunk){
    this.removeEventListener("error", thunk);
  }

  _withChange(act){
    return new Promise((resolve, reject) => {
      var onSuccess = () => {
          setTimeout(tearDown);
          resolve(this.element);
        },
        onError = (evt) => {
          setTimeout(tearDown);
          reject(evt);
        },
        stop = () => {
          if (this._changeTimeout) {
            clearTimeout(this._changeTimeout);
            this._changeTimeout = null;
          }
        },
        tearDown = () => {
          stop();
          this.removeChangeListener(onSuccess);
          this.removeErrorListener(onError);
        };

      this.addChangeListener(onSuccess, false);
      this.addErrorListener(onError, false);

      if (act()) {
        // we've already gotten lock, so don't wait for it.
        onSuccess();
      }
      else {
        // Timeout waiting on the lock to happen, for systems like iOS that
        // don't properly support it, even though they say they do.
        stop();
        this._changeTimeout = setTimeout(
          () => onError(name + " state did not change in allotted time"),
          1000);
      }
    });
  }

  /*
  pliny.method({
    parent: "Util.AsyncLockRequest",
    name: "request",
    returns: "Promise",
    description: "Cancel whatever effect the current lock request had. The returned promise resolves when the lock request completes, or throws if there is an error or a timeout waiting for the lock request.",
    parameters: [{
      name: "elem",
      type: "Element",
      description: "The DOM element on which to request the lock."
    }, {
      name: "extraParam",
      type: "Object",
      description: "This could be anything. Some of the lock request APIs provide other optional parameters. They get passed through here."
    }]
  });
  */
  request(elem, extraParam){
    return this._withChange(() => {
      if (!this._requestMethodName) {
        throw new Error("No " + this.name + " API support.");
      }
      else if (this.isActive) {
        return true;
      }
      else if (extraParam) {
        elem[this._requestMethodName](extraParam);
      }
      else {
        elem[this._requestMethodName]();
      }
    });
  }

  /*
  pliny.method({
    parent: "Util.AsyncLockRequest",
    name: "exit",
    description: "Cancel whatever effect the current lock request had."
  });
  */
  exit(){
    return this._withChange(() => {
      if (!this._exitMethodName) {
        throw new Error("No " + name + " API support.");
      }
      else if (!this.isActive) {
        return true;
      }
      else {
        document[this._exitMethodName]();
      }
    });
  }
}
