/*
pliny.class({
  parent: "Primrose.Controls",
  baseClass: "Primrose.BasePlugin",
  name: "Fader",
  description: "A black box around the user's head that fades in and out to hide transitions."
});
*/

import { BackSide } from "three";

import { box } from "../../live-api";

import BasePlugin from "../BasePlugin";

export default class Fader extends BasePlugin{
  constructor(options) {
    super("Fader", options, {
      rate: 5
    });
    this.fadeOutPromise = null;
    this.fadeOutPromiseResolver = null;
    this.fadeInPromise = null;
    this.fadeInPromiseResolver = null;
    this.mesh = null;
  }

  get requirements() {
    return ["head"];
  }

  _install(env) {
    this.mesh = box(1, 1, 1)
      .colored(env.options.backgroundColor, {
        opacity: 0,
        useFog: false,
        transparent: true,
        unshaded: true,
        side: BackSide
      })
      .addTo(env.head);

    this.mesh.visible = false;

    env.fader = this;
  }

  preUpdate(env, dt) {
    if(this.fadeOutPromise || this.fadeInPromise) {
      const m = this.mesh.material,
        f = this.options.rate * dt;

      if(this.fadeOutPromise) {
        m.opacity += f;
        if(1 <= m.opacity){
          m.opacity = 1;
          this.fadeOutPromiseResolver();
        }
      }
      else {
        m.opacity -= f;
        if(m.opacity <= 0){
          m.opacity = 0;
          this.fadeInPromiseResolver();
        }
      }

      m.needsUpdate = true;
    }
  }

  fadeOut(){
    if(this.fadeInPromise) {
      return Promise.reject("Currently fading in.");
    }
    if(!this.fadeOutPromise) {
      this.mesh.visible = true;
      this.mesh.material.opacity = 0;
      this.mesh.material.needsUpdate = true;
      this.fadeOutPromise = new Promise((resolve, reject) =>
        this.fadeOutPromiseResolver = (obj) => {
          this.fadeOutPromise = null;
          this.fadeOutPromiseResolver = null;
          resolve(obj);
        });
    }
    return this.fadeOutPromise;
  }

  fadeIn(){
    if(this.fadeOutPromise) {
      return Promise.reject("Currently fading out.");
    }
    if(!this.fadeInPromise){
      this.fadeInPromise = new Promise((resolve, reject) =>
        this.fadeInPromiseResolver = (obj) => {
          this.fadeInPromise = null;
          this.fadeInPromiseResolver = null;
          this.mesh.visible = false;
          resolve(obj);
        });
    }
    return this.fadeInPromise;
  }

  transition(thunk, check, immediate) {
    if(immediate) {
      thunk();
      return Promise.resolve();
    }
    else if(!check || check()){
      return this.fadeOut()
        .then(thunk)
        .then(() => this.fadeIn())
        .catch(console.warn.bind(console, "Error transitioning"));
    }
  }
}
