import FullScreen from "./FullScreen";
import standardLockBehavior from "./standardLockBehavior";

/*
pliny.function({
  parent: "Util",
  name: "standardFullScreenBehavior",
  description: "Requests Full Screen mode, and whether it succeeds or fails, executes the standardLockBehavior."
});
*/
export default function standardFullScreenBehavior(elem) {
  return FullScreen.request(elem)
    .catch((exp) => console.warn("FullScreen failed", exp))
    .then(standardLockBehavior);
};
