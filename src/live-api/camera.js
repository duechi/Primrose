/*
pliny.function({
  parent: "Live API",
  name: "camera",
  returns: "Primrose.Controls.Video",
  description: "Creates a mesh mapped with a texture that reads data from one of the cameras connected to the system. Camera resolution defaults to 1280x768.",
  parameters: [{
    name: "index",
    type: "Number",
    optional: true,
    default: 0,
    description: "The index of the object from the results of getUserMedia() to use for the camera."
  },{
    name: "options",
    type: "Live API.camera.optionsHash",
    optional: true,
    description: "Extra parameters for creating the mesh."
  }]
});
*/

/*
pliny.record({
  parent: "Live API.camera",
  name: "optionsHash",
  description: "Extra parameters for the selected camera, including resolution.",
  parameters: [{
    name: "width",
    type: "Number",
    description: "The width of the camera image to request. Note that if the camera does not support the resolution mode you are specifying, the request may not succeed, or may not give you the results you expect. The specific behavior is browser-specific and may also be camera-device-specific."
  }]
});
*/

import cameras from "./cameras";
import hub from "./hub";

import Video from "../Primrose/Controls/Video";


export default function camera(index, options) {
  options = Object.assign({
      width: 1,
      height: 768/1280,
      unshaded: true,
      transparent: true,
      opacity: 0.5
    }, options);
  return cameras()
    .then((devices) => navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: devices[index].deviceId,
        width: { ideal: 1280 },
        height: { ideal: 768 }
      }
    }))
    .catch(console.error.bind(console, "ERR [getting media access]:>"))
    .then((stream) => new Video(stream, options).ready)
    .catch(console.error.bind(console, "ERR [creating image]:>"));
};
