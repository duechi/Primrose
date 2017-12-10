import { isMobile, isiOS } from "../flags";
import Orientation from "./Orientation";
import PointerLock from "./PointerLock";

/*
pliny.function({
  parent: "Util",
  name: "standardUnlockBehavior",
  description: "On iOS, does nothing. On Android, removes the screen orientation lock. On desktop PCs, removes the moue pointer lock."
});
*/
export default function standardUnlockBehavior() {
  if (isMobile) {
    if(!isiOS) {
      Orientation.unlock();
    }
    return Promise.resolve();
  }
  else{
    return PointerLock.exit()
      .catch((exp) => console.warn("PointerLock exit failed", exp));
  }
};
