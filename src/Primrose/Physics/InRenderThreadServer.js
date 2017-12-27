import CANNON from "cannon";

import BaseServerPlugin from "./BaseServerPlugin";

import EntityManager from "./EntityManager";
import EngineServer from "./EngineServer";

const data = [],
  evt = { type: "message", data };

export default class InRenderThreadServer extends BaseServerPlugin {

  constructor() {
    super((name) => this._engine[name].bind(this._engine));
    this._engine = new EngineServer();
  }

  preUpdate(env, dt) {
    super.preUpdate(env, dt);
    this._engine.update(dt);
    for(let n = 0; n < this._engine.bodyIDs.length; ++n) {
      const id = this._engine.bodyIDs[n],
        body = this._engine.bodyDB[id],
        ent = EntityManager.entityDB[id];
      if(body && ent && body.sleepState !== CANNON.Body.SLEEPING) {
        ent.position.copy(body.position);
        ent.quaternion.copy(body.quaternion);
        ent.velocity.copy(body.velocity);
        ent.angularVelocity.copy(body.angularVelocity);
        ent.updateMatrix();
        ent.commit();
      }
    }
  }
}
