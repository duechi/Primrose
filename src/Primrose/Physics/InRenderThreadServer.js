import BasePlugin from "../BasePlugin";

import EngineServer from "./EngineServer";

export default class InRenderThreadServer extends BasePlugin {

  constructor() {
    super("PhysicsServer");

    this._engine = new EngineServer((data) => {
      this.dispatchEvent({ type: "message", data });
    });
  }

  get requirements() {
    return [];
  }

  _install(env) {
    env.physics = this;
  }

  postUpdate(env, dt) {
    this._engine.update(dt);
  }

  send(arr) {
    this._engine.recv(arr);
  }
}
