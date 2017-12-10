import standardUnlockBehavior from "./standardUnlockBehavior";
import FullScreen from "./FullScreen";

/*
pliny.function({
  parent: "Util",
  name: "standardExitFullScreenBehavior",
  description: "Performs the standardUnlockBehavior before exiting Full Screen mode."
});
*/
export default function standardExitFullScreenBehavior() {
  return standardUnlockBehavior()
    .then(() => FullScreen.exit())
    .catch((exp) => console.warn("FullScreen failed", exp));
};
