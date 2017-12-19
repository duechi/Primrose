/*
pliny.class({
  parent: "Primrose.Input",
  name: "Gamepad",
  baseClass: "Primrose.Input.PoseInputProcessor",
  description: "| [under construction]"
});
*/

function playPattern(devices, pattern, pause){
  if(pattern.length > 0){
    const length = pattern.shift();
    if(!pause){
      for(var i = 0; i < devices.length; ++i){
        devices[0].vibrate(1, length);
      }
    }
    setTimeout(playPattern, length, devices, pattern, !pause);
  }
}

import PoseInputProcessor from "./PoseInputProcessor";

export default class Gamepad extends PoseInputProcessor {

  constructor(padID, pad, axisOffset, hasOrientation, commands) {
    super(padID, commands, ["LSX", "LSY", "RSX", "RSY", "IDK1", "IDK2", "Z", "BUTTONS"]);

    this.currentDevice = pad;
    this.axisOffset = axisOffset;
    this.hasOrientation = hasOrientation;
  }

  getPose() {
    return this.currentPose;
  }

  checkDevice(pad) {
    this.inPhysicalUse = true;
    var i, j, buttonMap = 0;
    this.currentDevice = pad;
    this.currentPose = this.hasOrientation && this.currentDevice.pose;
    for (i = 0, j = pad.buttons.length; i < pad.buttons.length; ++i, ++j) {
      var btn = pad.buttons[i];
      this.setButton(i, btn.pressed);
      if (btn.pressed) {
        buttonMap |= 0x1 << i;
      }

      this.setButton(j, btn.touched);
      if(btn.touched){
        buttonMap |= 0x1 << j;
      }
    }
    this.setAxis("BUTTONS", buttonMap);
    for (i = 0; i < pad.axes.length; ++i) {
      var axisName = this.axisNames[this.axisOffset * pad.axes.length + i],
        axisValue = pad.axes[i];
      this.setAxis(axisName, axisValue);
    }
  }

  vibratePattern(pattern) {
    if(this.currentDevice){
      if (this.currentDevice.vibrate) {
        this.currentDevice.vibrate(pattern);
      }
      else if(this.currentDevice.haptics && this.currentDevice.haptics.length > 0) {
        playPattern(this.currentDevice.haptics, pattern);
      }
    }
  }

  get haptics() {
    return this.currentDevice && this.currentDevice.haptics;
  }
}
