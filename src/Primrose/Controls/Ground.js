import { quad } from "../../live-api";

import Entity from "./Entity";
import Image from "./Image";
import BasePlugin from "../BasePlugin";
import Pointer from "../Pointer";
import ModelFactory from "../Graphics/ModelFactory";

import { Raycaster, Vector3, Object3D } from "three";

import CANNON from "cannon";


const heightTester = new Raycaster();

heightTester.ray.direction.set(0, -1, 0);

/*
pliny.record({
  parent: "Primrose.Controls.Ground",
  name: "optionsHash",
  parameters: [{
    name: "texture",
    type: "String",
    optional: true,
    description: "The texture to use for the ground."
  }, {
    name: "model",
    type: "String",
    optional: true,
    default: null,
    description: "A model file to use for the ground."
  }]
});
*/
export default class GroundPlugin extends BasePlugin {
  constructor(options) {
    super("Ground", options);
  }

  get requirements() {
    return ["scene"];
  }

  _install(env) {
    return new Ground({
      transparent: false,
      dim: env.options.drawDistance,
      texture: this.options.texture,
      model: this.options.model,
      progress: env.options.progress
    }).ready.then((ground) =>
      env.ground = ground.addTo(env.scene));
  }

  postUpdate(env, dt) {
    env.ground.moveTo(env.head.position);
  }

}


class Ground extends Entity {

  constructor(options) {
    super("Ground", options);

    this.model = null;
    this.isInfinite = null;
  }

  get _ready() {
    const dim = this.options.dim,
      type = typeof  this.options.texture;

    let promise = null;

    if(this.options.model) {
      promise = ModelFactory.loadObject(this.options.model)
        .then((model) => {
          this.model = model;
          this.isInfinite = false;
        });
    }
    else if(type === "number") {
      this.isInfinite = true;
      this.model = quad(dim, dim)
        .colored(this.options.texture, this.options);
      promise = Promise.resolve();
    }
    else if(type === "string") {
      this.isInfinite = true;
      this.model = new Image(this.options.texture, {
        width: dim,
        height: dim,
        txtRepeatX: dim,
        txtRepeatY: dim,
        anisotropy: 8
      });

      promise = this.model.ready;
    }
    else {
      this.model = new Object3D();
      promise = Promise.resolve();
    }

    promise = promise.then(() => {
      if(this.isInfinite != null) {
        this.model
          .named(this.name + "-" + (this.options.model || this.options.texture))
          .addTo(this);

        this.watch(this.model, Pointer.EVENTS);

        this.rigidBody = new CANNON.Body({
          mass: 0,
          type: CANNON.Body.KINEMATIC
        });

        if(this.isInfinite) {
          const groundShape = new CANNON.Plane();
          this.rigidBody.addShape(groundShape);
          this.rigidBody.quaternion.setFromVectors(
            CANNON.Vec3.UNIT_Z,
            CANNON.Vec3.UNIT_Y);
        }
      }
    });

    return promise;
  }

  moveTo(pos) {
    if(this.isInfinite) {
      const x = Math.floor(pos.x),
        z = Math.floor(pos.z);
      if(this.rigidBody) {
        this.rigidBody.position.set(x, 0, z);
      }
      else {
        this.position.set(x, 0, z);
      }
    }
  }

  getHeightAt(pos) {
    if(this.model) {
      heightTester.ray.origin.copy(pos);
      heightTester.ray.origin.y = 100;
      const hits = heightTester.intersectObject(this.model);
      if(hits.length > 0) {
        const hit = hits[0];
        return 100 - hit.distance;
      }
    }
  }
};
