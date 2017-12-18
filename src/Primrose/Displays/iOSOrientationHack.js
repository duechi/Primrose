import { isiOS, isLandscape } from "../../flags";

import BasePlugin from "../BasePlugin";

/*
pliny.class({
  parent: "Primrose.Controls",
  baseClass: "Primrose.BasePlugin",
  name: "iOSOrientationHack",
  description: "Makes up for iOS not firing the `resize` event on the window when the user changes orientation of their device."
});
*/

export default class iOSOrientationHack extends BasePlugin {
  constructor() {
    super("iOSOrientationHack");
    this.wasLandscape = isLandscape();
  }

  get requirements() {
    return [];
  }

  _install(env) {

  }

  preUpdate(env, dt) {
    if(isiOS) {
      const nowLandscape = isLandscape();
      if(nowLandscape !== wasLandscape) {
        window.dispatchEvent(new Event("resize"));
      }
    }
  }
};
