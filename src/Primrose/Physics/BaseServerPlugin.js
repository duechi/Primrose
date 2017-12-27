import BasePlugin from "../BasePlugin";

export default class BaseServerPlugin extends BasePlugin {

  constructor(options, defaults) {
    super("PhysicsServer", options, defaults);
  }

  get requirements() {
    return ["scene"];
  }

  _install(env) {
    env.physics = this;
  }

  send(arr) {
    throw new Error("Not implemented: Primrose.Physics.BaseServerPlugin::send(arr)");
  }
}
