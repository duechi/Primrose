import { TextGeometry, FontLoader } from "three";

import BasePlugin from "../BasePlugin";

const loader = new FontLoader();

export default class Text3D extends BasePlugin {

  constructor(options) {
    super("Text3D", options);
  }

  get requirements() {
    return [];
  }

  _install(env) {
    let task = null;
    if(typeof this.options.font === "string") {
      task = new Promise((resolve, reject) =>
        loader.load(this.options.font, resolve, null, reject));
    }
    else {
      task = Promise.resolve(loader.parse(this.options.font));
    }

    return task.then((font) => {
      window.text3D = function (size, text) {
        var geom = new TextGeometry(text, {
          font,
          size,
          height: size / 5,
          curveSegments: 2
        });
        geom.computeBoundingSphere();
        geom.computeBoundingBox();
        return geom;
      };
    });
  }
};
