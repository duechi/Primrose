/*
pliny.class({
  parent: "Primrose.Plugin",
  name: "BasePlugin",
  description: "A common base class for all plugins."
});
*/
export default class BasePlugin {

  constructor(options) {
    this.options = options;
  }

  install(env) {
    throw new Error("Primrose.Plugin.BasePlugin::install > not implemented");
  }

};
