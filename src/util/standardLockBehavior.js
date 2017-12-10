import { isMobile, isiOS } from "../flags";
import Orientation from "./Orientation";
import PointerLock from "./PointerLock";

/*
pliny.function({
  parent: "Util",
  name: "standardLockBehavior",
  description: "On iOS devices, this function does nothing. On Android mobile devices, it locks the screen orientation. On desktop devices, it locks the mouse pointer to the view.",
  parameters: [{
    name: "elem",
    type: "Element",
    description: "The DOM element to which to perform the lock operations."
  }]
});
*/
export default function standardLockBehavior(elem) {
  if(isiOS) {
    return Promise.resolve(elem);
  }
  else if (isMobile) {
    return Orientation.lock(elem)
      .catch((exp) => console.warn("OrientationLock failed", exp));
  }
  else {
    return PointerLock.request(elem)
      .catch((exp) => console.warn("PointerLock failed", exp));
  }
};
