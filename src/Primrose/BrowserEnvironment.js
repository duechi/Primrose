import { DeckGrid, Helvetiker } from "../assets";

import { isCardboard } from "../flags";

import { any, coalesce } from "../util";

import Environment from "./Environment";
import { Audio3D, Music } from "./Audio";
import { Ground, Sky, Fader } from "./Controls";
import { iOSOrientationHack, PresentationUI } from "./Displays";
import { Shadows, Fog, Text3D, ModelFactoryPlugin } from "./Graphics";
import { Clipboard, GamepadManager } from "./Input";
import { EntityManager, InRenderThreadEngine, InWorkerThreadWithTransferablesEngine as InWorkerThreadEngine } from "./Physics";
import { Teleporter } from "./Tools";
import { Manager } from "./Network";

function normalizeOptions(options) {

  // normalize the inputs
  options = coalesce({
    backgroundColor: 0x000000,
    enableShadows: true,
    font: Helvetiker,
    fullScreenElement: document.body,
    nonstandardNeckLength: 0.15,
    nonstandardNeckDepth: 0.075,
    plugins: [],
    useFog: true,
    useGaze: isCardboard,
    physics: "../../PrimrosePhysics.js"
  }, options);

  if(!options.groundTexture && !options.groundModel) {
    options.groundTexture = DeckGrid;
  }

  if(!options.skyTexture) {
    options.skyTexture = options.backgroundColor;
  }


  // configure default plugins
  const add = (Class, opts) => {
    if(!any(options.plugins, p => p instanceof Class)) {
      options.plugins.push(new Class(opts));
    }
  };

  add(EntityManager);

  add(iOSOrientationHack);

  add(Audio3D, { ambientSound: options.ambientSound });

  add(Music, { numNotes: options.numNotes });

  add(Text3D, { font: options.font });

  add(Sky, { texture: options.skyTexture });

  add(Ground, {
    texture: options.groundTexture,
    model: options.groundModel
  });

  add(Fader, { rate: options.fadeRate });

  add(PresentationUI, {
    buttonContainer: options.fullScreenButtonContainer,
    disableAdvertising: options.disableAdvertising
  });

  if(options.physics) {
    if(typeof options.physics === "string") {
      add(InWorkerThreadEngine, {
        gravity: options.gravity,
        workerPath: options.physics
      });
    }
    else{
      add(InRenderThreadEngine, { gravity: options.gravity });
    }
  }


  if(!options.disableTeleporter) {
    add(Teleporter);
  }

  if(!options.disableKeyboard) {
    add(Clipboard);
  }

  if(!options.disableGamepad && GamepadManager.isAvailable) {
    add(GamepadManager);
  }

  if(options.enableShadows) {
    add(Shadows, {
      mapSize: options.shadowMapSize,
      radius: options.shadowRadius,
      cameraSize: options.shadowCameraSize
    });
  }

  if(options.useFog) {
    add(Fog);
  }

  if(options.avatarModel) {
    add(ModelFactoryPlugin, {
      name: "avatar",
      modelFile: options.avatarModel
    });

    add(Manager);
  }

  return options;
}

export default class BrowserEnvironment extends Environment {
  constructor(options) {
    super(normalizeOptions(options));
  }
};

