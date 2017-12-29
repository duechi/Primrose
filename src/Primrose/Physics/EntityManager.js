import BasePlugin from "../BasePlugin";

export default class EntityManager extends BasePlugin {
  constructor() {
    super("EntityManager");
    this.entities = [];
    this._find =  (child) => {
      if(child.isEntity) {
        const i = this.entities.indexOf(child);
        if(i === -1) {
          child._index = this.entities.length;
          this.entities.push(child);
        }
      }
    };
  }

  get requirements() {
    return ["scene"];
  }

  _install(env, dt) {
    env.entities = this;
  }

  preUpdate(env, dt) {
    env.scene.traverse(this._find);
    for(let i = 0; i < this.entities.length; ++i) {
      this.entities[i].update(dt);
    }
  }

  postUpdate(env, dt) {
  }

  get count() {
    return this.entities.length;
  }

  get(id) {
    return this.entities[id];
  }
};
