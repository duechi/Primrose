import isCardboard from "../../../src/flags/isCardboard";
import Environment from "../../../src/Primrose/Environment";
import Ground from "../../../src/Primrose/Controls/Ground";
import Sky from "../../../src/Primrose/Controls/Sky";
import Fader from "../../../src/Primrose/Controls/Fader";
import iOSOrientationHack from "../../../src/Primrose/Displays/iOSOrientationHack";
import PresentationUI from "../../../src/Primrose/Displays/PresentationUI";
import Fog from "../../../src/Primrose/Graphics/Fog";
import GamepadManager from "../../../src/Primrose/Input/GamepadManager";
import Teleporter from "../../../src/Primrose/Tools/Teleporter";

const options = {
    fullScreenElement: document.body,
    backgroundColor: 0x000000,
    nonstandardNeckLength: 0.15,
    nonstandardNeckDepth: 0.075,
    useFog: true,
    useGaze: isCardboard,
    plugins: [
      new iOSOrientationHack(),
      new Ground({ texture: "../shared_assets/images/deck.min.png" }),
      new Fader(),
      new Teleporter(),
      new PresentationUI({ buttonContainer: "#fullScreenButtonContainer" }),
      new Fog()
    ]
  };

if(GamepadManager.isAvailable) {
  options.plugins.push(new GamepadManager());
}

const env = new Environment(options);

export default env;
