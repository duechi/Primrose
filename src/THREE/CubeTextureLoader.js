/*
pliny.method({
  parent: "THREE.CubeTextureLoader",
  name: "load",
  description: "Overwrites the current CubeTextureLoader class' `load` method to fix bugs encountered in Three.js r85."
});
*/

import { CubeTextureLoader, CubeTexture, ImageLoader } from "three";

CubeTextureLoader.prototype.load = function(urls, onLoad, onProgress, onError) {
  const texture = new CubeTexture(),
    loader = new ImageLoader(this.manager);

  let loaded = 0;

  loader.setCrossOrigin(this.crossOrigin);
  loader.setPath(this.path);

  urls.forEach((url, i) => {
    loader.load(url, (image) => {

      texture.images[i] = image;
      ++loaded;

      if (loaded === 6) {
        texture.needsUpdate = true;
        if (onLoad) {
          onLoad(texture);
        }
      }

    }, onProgress, onError);
  });

  return texture;
};
