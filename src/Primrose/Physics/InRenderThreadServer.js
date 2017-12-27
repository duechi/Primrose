import CANNON from "cannon";

import BaseServerPlugin from "./BaseServerPlugin";

import EntityManager from "./EntityManager";
import EngineServer from "./EngineServer";

const data = [],
  evt = { type: "message", data };

export default class InRenderThreadServer extends BaseServerPlugin {

  constructor() {
    super();
    this._engine = new EngineServer();
  }

  postUpdate(env, dt) {
    this._engine.update(dt);
    let i = 0;
    for(let n = 0; n < this._engine.bodyIDs.length; ++n) {
      const id = this._engine.bodyIDs[n],
        body = this._engine.bodyDB[id];
      if(body.sleepState !== CANNON.Body.SLEEPING) {
        data[i + 0] = id;
        data[i + 1] = body.position.x;
        data[i + 2] = body.position.y;
        data[i + 3] = body.position.z;
        data[i + 4] = body.quaternion.x;
        data[i + 5] = body.quaternion.y;
        data[i + 6] = body.quaternion.z;
        data[i + 7] = body.quaternion.w;
        data[i + 8] = body.velocity.x;
        data[i + 9] = body.velocity.y;
        data[i + 10] = body.velocity.z;
        data[i + 11] = body.angularVelocity.x;
        data[i + 12] = body.angularVelocity.y;
        data[i + 13] = body.angularVelocity.z;
        i += 14;
      }
    }

    this.dispatchEvent(evt);
  }

  send(arr) {
    this._engine.recv(arr);
  }
}
