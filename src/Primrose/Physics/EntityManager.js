import BasePlugin from "../BasePlugin";

export default class EntityManager extends BasePlugin {
  constructor() {
    super("EntityManager");
  }

  get requirements() {
    return [];
  }

  _install(env, dt) {
    env.entities = this;
  }

  postUpdate(env, dt) {
    for(let i = 0; i < EntityManager.entities.length; ++i) {
      EntityManager.entities[i].update();
    }
  }
}

EntityManager.entities = [];
EntityManager.entityDB = {};
