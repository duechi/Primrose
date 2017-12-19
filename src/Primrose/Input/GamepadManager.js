/*
pliny.class({
  parent: "Primrose.Input",
  name: "GamepadManager",
  baseClass: "THREE.EventDispatcher",
  description: "| [under construction]"
});
*/

const blackList = [
"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2910.0 Safari/537.36"
];


navigator.getGamepads = navigator.getGamepads ||
  navigator.webkitGetGamepads;

import BasePlugin from "../BasePlugin";

import Gamepad from "./Gamepad";
import MotionController from "./MotionController";

function isMotionController(pad){
  if(pad) {
    const obj = pad.capabilities || pad.pose;
    return obj && obj.hasOrientation;
  }
  return false;
}

function makeID(pad) {
  console.info(`found gamepad: ${pad.id}.`);

  let id = pad.id;

  if (id === "OpenVR Gamepad") {
    id = "Vive";
  }
  else if (id.indexOf("Rift") === 0) {
    id = "Rift";
  }
  else if (id.indexOf("Unknown") === 0) {
    id = "Unknown";
  }
  else {
    id = "Gamepad";
  }

  id = (id + "_" + (pad.index || 0))
    .replace(/\s+/g, "_");

  return id;
}

export default class GamepadManager extends BasePlugin {

  static get isAvailable() {
    return blackList.indexOf(navigator.userAgent) === -1
     && !!navigator.getGamepads;
  }

  constructor(){
    super("GamepadManager");
    this.currentDevices = [];
    this.currentDeviceIDs = [];
    this.currentManagers = {};
  }

  get requirements() {
    return [];
  }

  _install(env) {
    env.gamepadMgr = this;
    this.addEventListener("gamepaddisconnected", env.removeInputManager.bind(env));
    this.addEventListener("gamepadconnected", (mgr) => {
      env.addInputManager(mgr);

      if (mgr.hasOrientation) {
        env.motionDevices.push(mgr);

        mgr.ptr
          .addTo(env.scene)
          .route(Pointer.EVENTS, env.consumeEvent.bind(env));

        env.pointers.push(mgr.ptr);

        env.emit("motioncontrollerfound", mgr);
      }
      else {
        env.mousePointer.addDevice(mgr, mgr);
      }

    });
  }

  preUpdate(env, dt) {
    if(GamepadManager.isAvailable){
      const maybePads = navigator.getGamepads(),
        pads = [],
        padIDs = [],
        newPads = [],
        oldPads = [];

      if (maybePads) {
        for (let i = 0; i < maybePads.length; ++i) {
          const maybePad = maybePads[i];
          if (maybePad) {
            const padID = GamepadManager.ID(maybePad),
              padIdx = this.currentDeviceIDs.indexOf(padID);

            pads.push(maybePad);
            padIDs.push(padID);

            if (padIdx === -1) {
              this.currentDeviceIDs.push(padID);
              this.currentDevices.push(maybePad);
              this.currentManagers[padID] = this._makeManager(maybePad, env);
              newPads.push(this.currentManagers[padID]);
            }
            else {
              this.currentDevices[padIdx] = maybePad;
            }
          }
        }
      }

      for (let i = this.currentDeviceIDs.length - 1; i >= 0; --i) {
        const padID = this.currentDeviceIDs[i],
          mgr = this.currentManagers[padID],
          pad = this.currentDevices[i];

        if (padIDs.indexOf(padID) === -1) {
          oldPads.push(padID);
          this.currentDevices.splice(i, 1);
          this.currentDeviceIDs.splice(i, 1);
          delete this.currentManagers[padID];
        }
        else if (mgr) {
          mgr.checkDevice(pad);
        }
      }

      newPads.forEach(this.emit.bind(this, "gamepadconnected"));
      oldPads.forEach(this.emit.bind(this, "gamepaddisconnected"));
    }
  }

  _makeManager(pad, env) {
    const padID = makeID(pad);
    if (padID !== "Unknown" && padID !== "Rift") {
      if (isMotionController(pad)) {
        return new MotionController(padID, pad, {
          buttons: {
            axes: ["BUTTONS"]
          },
          dButtons: {
            axes: ["BUTTONS"],
            delta: true
          },
          zero: {
            buttons: [GamepadManager.VIVE_BUTTONS.GRIP_PRESSED],
            commandUp: env.emit.bind(env, "zero")
          }
        });
      }
      else {
        return new Gamepad(padID, pad, 0, false, {
          buttons: {
            axes: ["BUTTONS"]
          },
          dButtons: {
            axes: ["BUTTONS"],
            delta: true
          },
          strafe: {
            axes: ["LSX"],
            deadzone: 0.2
          },
          drive: {
            axes: ["LSY"],
            deadzone: 0.2
          },
          heading: {
            axes: ["RSX"],
            scale: -1,
            deadzone: 0.2,
            integrate: true
          },
          dHeading: {
            commands: ["heading"],
            delta: true
          },
          pitch: {
            axes: ["RSY"],
            scale: -1,
            deadzone: 0.2,
            integrate: true
          },
          zero: {
            buttons: [GamepadManager.XBOX_ONE_BUTTONS.BACK],
            commandUp: env.emit.bind(env, "zero")
          }
        });
      }
    }
  }

  get pads() {
    return this.currentDevices;
  }
}


/*
pliny.enumeration({
  parent: "Primrose.Input.GamepadManager",
  name: "XBOX_360_BUTTONS",
  description: "Labeled names for each of the different control features of the Xbox 360 controller."
});
*/
GamepadManager.XBOX_360_BUTTONS = {
  A: 1,
  B: 2,
  X: 3,
  Y: 4,
  LEFT_BUMPER: 5,
  RIGHT_BUMPER: 6,
  LEFT_TRIGGER: 7,
  RIGHT_TRIGGER: 8,
  BACK: 9,
  START: 10,
  LEFT_STICK: 11,
  RIGHT_STICK: 12,
  UP_DPAD: 13,
  DOWN_DPAD: 14,
  LEFT_DPAD: 15,
  RIGHT_DPAD: 16
};

/*
pliny.enumeration({
  parent: "Primrose.Input.GamepadManager",
  name: "XBOX_ONE_BUTTONS",
  description: "Labeled names for each of the different control features of the Xbox 360 controller."
});
*/
GamepadManager.XBOX_ONE_BUTTONS = {
  A: 1,
  B: 2,
  X: 3,
  Y: 4,
  LEFT_BUMPER: 5,
  RIGHT_BUMPER: 6,
  LEFT_TRIGGER: 7,
  RIGHT_TRIGGER: 8,
  BACK: 9,
  START: 10,
  LEFT_STICK: 11,
  RIGHT_STICK: 12,
  UP_DPAD: 13,
  DOWN_DPAD: 14,
  LEFT_DPAD: 15,
  RIGHT_DPAD: 16
};

/*
pliny.enumeration({
  parent: "Primrose.Input.GamepadManager",
  name: "VIVE_BUTTONS",
  description: "Labeled names for each of the different control buttons of the HTC Vive Motion Controllers."
});
*/
GamepadManager.VIVE_BUTTONS = {
  TOUCHPAD_PRESSED: 0,
  TRIGGER_PRESSED: 1,
  GRIP_PRESSED: 2,
  MENU_PRESSED: 3,

  TOUCHPAD_TOUCHED: 4,
  //TRIGGER_TOUCHED: 5, // doesn't ever actually trigger in the current version of Chromium - STM 6/22/2016
  GRIP_TOUCHED: 6,
  MENU_TOUCHED: 7
};
