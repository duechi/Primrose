import { FullScreen, PointerLock } from "../../util";

import BasePlugin from "../BasePlugin";


  /*
  pliny.method({
    parent: "Primrose.Environment",
    name: "insertFullScreenButtons",
    description: "Add the default UI for managing full screen state.",
    returns: "Array of `HTMLButtonElement`s",
    parameters: [{
      name: "containerSpec",
      type: "String",
      description: "A query selector for the DOM element to which to add the buttons."
    }]
  });
  */
export default class PresentationUI extends BasePlugin {
  constructor(options) {
    super("PresentationUI", options);
  }

  get requirements() {
    return ["renderer", "displays", "Mouse", "VR"];
  }

  _install(env) {

    window.addEventListener("vrdisplaypresentchange", (evt) => {
      const presenting = env.VR.isPresenting,
        lockMouse = !presenting || env.VR.isStereo,
        scale = presenting ? -1 : 1;
      env.Mouse.enable("U", lockMouse);
      env.Mouse.enable("V", lockMouse);
      env.Mouse.setScale("heading", scale);
      env.Mouse.setScale("pitch", scale);
      if (!presenting) {
        env.cancelVR();
      }
      env._modifyScreen();
    }, false);

    PointerLock.addChangeListener((evt) => {
      if(PointerLock.isActive) {
        env.Mouse.removeButton("dx", 0);
        env.Mouse.removeButton("dy", 0);
      }
      else {
        env.Mouse.addButton("dx", 0);
        env.Mouse.addButton("dy", 0);
        if (env.VR.isPresenting) {
          env.cancelVR();
        }
      }
    });

    if(this.options.buttonContainer){
      const container = document.querySelector(this.options.buttonContainer);
      const newButton = (title, text, thunk) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.title = title;
        btn.appendChild(document.createTextNode(text));
        btn.addEventListener("click", thunk, false);
        container.appendChild(btn);
        return btn;
      };

      const buttons = env.displays
        .map((display, i) => {
          const enterVR = env.goFullScreen.bind(env, i),
            btn = newButton(display.displayName, display.displayName, enterVR);
          btn.className = "enterVRButton " + display.isStereo ? "stereo" : "mono";
          return btn;
        });

      if(!/(www\.)?primrosevr.com/.test(document.location.hostname) && !this.options.disableAdvertising) {
        const visitPrimroseButton = newButton("Primrose", "✿", () => open("https://www.primrosevr.com", "_blank"));
        visitPrimroseButton.className = "visitPrimroseButton";
        buttons.push(visitPrimroseButton);
      }

      const exitFullScreenButton = newButton("Exit Fullscreen", "🗙", () => {
        FullScreen.exit();
        PointerLock.exit();
      });

      exitFullScreenButton.className = "exitVRButton"
      exitFullScreenButton.style.display = "none";

      buttons.push(exitFullScreenButton);

      FullScreen.addChangeListener(() => {
        const enterVRStyle = FullScreen.isActive ? "none" : "",
          exitVRStyle = FullScreen.isActive ? "" : "none";

        buttons.forEach((btn) =>
          btn.style.display = enterVRStyle);

        exitFullScreenButton.style.display = exitVRStyle;
      });
    }
  }
}
