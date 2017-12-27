import { EventDispatcher } from "three";

import EngineServer from "./EngineServer";

export default class InRenderThreadServer extends EventDispatcher {
  
  constructor() {
    super();
    this._engine = new EngineServer((data) => {
      this.dispatchEvent({ type: "data", data });
    });
  }

  send(arr) {
    this._engine.recv(arr);
  }
}