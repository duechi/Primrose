import { box } from "../../live-api";

import Pointer from "../Pointer";

import Gamepad from "./Gamepad";

export default class MotionController extends Gamepad {
  constructor(padID, pad, commands) {
    let controllerNumber = 0;
    for(let key in mgr.currentManagers) {
      m = mgr.currentManagers[key];
      if (m.currentPad && m.currentPad.id === pad.id) {
        ++controllerNumber;
      }
    }

    super(padID, pad, controllerNumber, true, commands);

    const shift = controllerNumber * 8,
      color = 0x0000ff << shift,
      highlight = 0xff0000 >> shift;

    this.ptr = new Pointer(padID + "Pointer", color, 1, highlight, [mgr], null, this.options);

    // a rough model to represent the motion controller
    this.mesh = box(0.1, 0.025, 0.2)
      .colored(color, { emissive: highlight })
      .addTo(this.ptr);
  }
};
