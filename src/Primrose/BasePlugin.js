import { EventDispatcher } from "three";

import { coalesce } from "../util";
/*
pliny.class({
  parent: "Primrose.Plugin",
  name: "BasePlugin",
  baseClass: "THREE.EventDispatcher",
  description: "A common base class for all plugins.",
  parameters: [{
    name: "name",
    type: "String",
    description: "A friendly name for the plugin."
  }, {
    name: "options",
    type: "Object",
    description: "A hash object for optional parameters",
    optional: true,
    default: null
  }, {
    name: "defaults",
    type: "Object",
    description: "A hash object containing the default values for all optional parameters",
    optional: true,
    default: null
  }]
});
*/
export default class BasePlugin extends EventDispatcher {

  constructor(name, options, defaults) {
    super();
    this.retry = 3;
    this.name = name;
    this.options = coalesce({}, defaults, options);
  }

  /*
  pliny.property({
    parent: "Primrose.Plugin.BasePlugin",
    name: "requirements",
    type: "Array",
    description: "An array of strings defining accessor paths into the BrowserEnvironment to check for the existence of properties that are required before the plugin can install."
  })
  */
  get requirements() {
    throw new Error("Primrose.Plugin.BasePlugin::get$requirements() > not implemented");
  }

  /*
  pliny.method({
    parent: "Primrose.Plugin.BasePlugin",
    name: "requirementsMet",
    returns: "Boolean",
    description: "Returns true when the BrowserEnvironment has all of the properties specified in this object's `requirements` property."
    parameters: [{
      name: "env",
      type: "Primrose.BrowserEnvironment",
      description: "The BrowserEnvironment to check."
    }]
  });
  */
  requirementsMet(env) {

    const reqs = this.requirements,
      missing = [];

    for(let i = 0; reqs && i < reqs.length; ++i) {

      const parts = reqs[i].split(".");
      let head = env,
        name = "";

      for(let j = 0; j < parts.length; ++j) {

        if(head) {
          head = head[parts[j]];
        }

        if(name.length > 0) {
          name += ".";
        }
        name += parts[j];

        if(!head && missing.indexOf(name) === -1) {
          missing.push(name);
        }
      }

    }

    return missing;
  }

  get isBasePlugin() { return true; }

  /*
  plugin.method({
    parent: "Primrose.Plugin.BasePlugin",
    name: "install",
    returns: "Array",
    description: "Once the pre-requisites are met, installs the necessary plugin functionality to the BrowserEnvironment. Plugins may also choose to return a new list of plugins that must also be installed after this plugin is installed.",
    parameters: [{
      name: "env",
      type: "Primrose.BrowserEnvironment",
      description: "The BrowserEnvironment to modify."
    }]
  });
  */
  install(env) {
    let task = this._install(env);

    if(!(task instanceof Promise)) {
      task = Promise.resolve(task);
    }

    return task.then((results) => {
      if(results === undefined || results === null) {
        results = [];
      }
      else if(!(results instanceof Array)) {
        results = [results];
      }

      return results.filter(r => r.isBasePlugin);
    });
  }

  _install(env) {
    throw new Error("Primrose.Plugin.BasePlugin::install() > not implemented");
  }

  start() {

  }

  stop() {

  }

  /*
  plugin.method({
    parent: "Primrose.Plugin.BasePlugin",
    name: "preUpdate",
    description: "Modify the BrowserEnvironment before the main update loop performs.",
    parameters: [{
      name: "env",
      type: "Primrose.BrowserEnvironment",
      description: "The BrowserEnvironment to modify."
    }, {
      name: "dt",
      type: "Number",
      description: "The number of seconds that have passed since the last update."
    }]
  });
  */
  preUpdate(env, dt) {

  }


  /*
  plugin.method({
    parent: "Primrose.Plugin.BasePlugin",
    name: "preUpdate",
    description: "Modify the BrowserEnvironment after the main update loop performs.",
    parameters: [{
      name: "env",
      type: "Primrose.BrowserEnvironment",
      description: "The BrowserEnvironment to modify."
    }, {
      name: "dt",
      type: "Number",
      description: "The number of seconds that have passed since the last update."
    }]
  });
  */
  postUpdate(env, dt) {

  }

};
