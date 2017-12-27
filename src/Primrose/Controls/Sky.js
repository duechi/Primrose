import { Object3D } from "three";

import { box, quad, sphere } from "../../live-api";
import { isMobile } from "../../flags";
import BasePlugin from "../BasePlugin";
import Entity from "./Entity";
import Image from "./Image";

import { DirectionalLight, AmbientLight, BackSide } from "three";

/*, {
    name: "texture",
    type: "String or Array of String",
    optional: true,
    description: "The texture(s) to use for the sky."
  }*/
export default class SkyPlugin extends BasePlugin {
  constructor(options) {
    super("Sky", options);
  }

  get requirements(){
    return ["scene"];
  }

  _install(env) {
    env.sky = new Sky({
      transparent: false,
      useFog: false,
      unshaded: true,
      texture: this.options.texture,
      skyRadius: env.options.drawDistance,
      progress: env.options.progress
    });

    return env.sky.ready.then(() =>
      env.sky.addTo(env.scene));
  }

  postUpdate(env, dt) {
    env.sky.position.copy(env.head.position);
  }
}

class Sky extends Entity {

  constructor(options) {
    super("Sky", options);

    this._image = null;

    if(options.disableDefaultLighting) {
      this.ambient = null;
      this.sun = null;
    }
    else{

      /*
      pliny.property({
        parent: "Primrose.Controls.Sky",
        name: "ambient",
        type: "THREE.AmbientLight",
        description: "If the `disableDefaultLighting` option is not present, the ambient light provides a fill light so that dark areas do not completely obscure object details."
      });
      */
      this.ambient = new AmbientLight(0xffffff, 0.5)
        .addTo(this);

      /*
      pliny.property({
        parent: "Primrose.Controls.Sky",
        name: "sun",
        type: "THREE.PointLight",
        description: "If the `disableDefaultLighting` option is not present, the sun light provides a key light so that objects have shading and relief."
      });
      */
      this.sun = new DirectionalLight(0xffffff, 1)
        .addTo(this)
        .at(0, 100, 100);

      this.add(this.sun.target);
    }
  }

  replace(files){
    this.options.texture = files;
    this.children.splice(0);
    return this.load();
  }

  load() {
    return super.load()
      .then(() => {
        const type = typeof  this.options.texture;
        if(type === "string") {
          this.options.side = BackSide;
          return sphere(0.95 * this.options.skyRadius, 46, 24)
            .textured(this.options.texture, this.options);
        }
        else if(this.options.texture instanceof Array && this.options.texture.length === 6 && typeof this.options.texture[0] === "string") {
          return new Image(this.options.texture, this.options);;
        }
        else if(type === "number") {
          // we don't have to do anything, the renderer's clear color will take care of it.
          return new Object3D();
        }
        else {
          throw new Error("Couldn't figure out what to do with the Sky", this.options);
        }
      })
      .then((sky) => {
        this._image = sky.addTo(this);
      });
  }


};
