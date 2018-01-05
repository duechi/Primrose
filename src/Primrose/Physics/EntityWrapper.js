export default class EntityWrapper {
  constructor(ent) {
    this.index = ent._index;
    this.position = ent.position;
    this.velocity = ent.velocity;
    this.quaternion = ent.quaternion;
    this.angularVelocity = ent.angularVelocity;
  }
};