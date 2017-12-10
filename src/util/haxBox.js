/*
pliny.namespace({
  parent: "Util",
  name: "haxBox",
  description: "This is a side-effecting module that captures the set of ICE servers that TokBox uses, and injects new getUserMedia parameters to enable screensharing. This module is not included in the public distribution, you have to `import` it manually."
});
*/

import haxClass from "./haxClass";
import haxFunction from "./haxFunction";

function injectIceServers(target, name) {
  haxClass(target, name, function(args) {
    if(!window.HAXICE) {
      window.HAXICE = args[0];
    }
    args[0] = args[0] || window.HAXICE;
  });
}

function injectUserMedia(target, name) {
  haxFunction(target, name, function(args) {
    args[0] = window.HAKBOX || args[0];
  });
}

injectIceServers(window, "RTCPeerConnection");
injectIceServers(window, "webkitRTCPeerConnection");

injectUserMedia(navigator, "webkitGetUserMedia");
injectUserMedia(navigator, "getUserMedia");
injectUserMedia(navigator.mediaDevices, "getUserMedia");
