import BasePlugin from "../BasePlugin";

export default class EntityManager extends BasePlugin {
  constructor() {
    super("EntityManager");
    this.entities = [];
    this.entityDB = {};
    this._find =  (child) => {
      if(child.isEntity) {
        const i = this.entities.indexOf(child);
        if(i === -1) {
          this.entities.push(child);
          this.entityDB[child.uuid] = child;
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
  }

  postUpdate(env, dt) {
    for(let i = 0; i < this.entities.length; ++i) {
      this.entities[i].update();
    }
  }

  get count() {
    return this.entities.length;
  }

  get(id) {
    const t = typeof id;
    if(t === "number") {
      return this.entities[id];
    }
    else if(t === "string") {
      return this.entityDB[id];
    }
  }
};
