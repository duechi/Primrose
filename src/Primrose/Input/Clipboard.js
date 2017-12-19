import { cascadeElement, makeHidingContainer } from "../DOM";

import BasePlugin from "../BasePlugin";

function setFalse(evt) {
  evt.returnValue = false;
}

export default class Clipboard extends BasePlugin {

  constructor() {
    super("Clipboard");
  }

  get requirements() {
    return ["Keyboard"];
  }

  _install(env) {
    const clipboardOperation = (evt) => {
      if (env.currentControl) {
        env.currentControl[evt.type + "SelectedText"](evt);
        if (!evt.returnValue) {
          evt.preventDefault();
        }
        surrogate.style.display = "none";
        env.currentControl.focus();
      }
    };

    // the `surrogate` textarea makes clipboard events possible
    var surrogate = cascadeElement("primrose-surrogate-textarea", "textarea", HTMLTextAreaElement),
      surrogateContainer = makeHidingContainer("primrose-surrogate-textarea-container", surrogate);

    surrogateContainer.style.position = "absolute";
    surrogateContainer.style.overflow = "hidden";
    surrogateContainer.style.width = 0;
    surrogateContainer.style.height = 0;

    surrogate.addEventListener("beforecopy", setFalse, false);
    surrogate.addEventListener("copy", clipboardOperation, false);
    surrogate.addEventListener("beforecut", setFalse, false);
    surrogate.addEventListener("cut", clipboardOperation, false);

    window.addEventListener("beforepaste", setFalse, false);
    window.addEventListener("paste", (evt) => {
      if (env.currentControl) {
        if (env.currentControl.readClipboard) {
          env.currentControl.readClipboard(evt);
        }
        else {
          console.warn("Couldn't find readClipboard on %o", env.currentControl);
        }
      }
    }, false);

    window.addEventListener("keydown", (evt) => {
      if (env.lockMovement) {
        var cmdName = env.Keyboard.operatingSystem.makeCommandName(evt, env.Keyboard.codePage);
        if (cmdName === "CUT" || cmdName === "COPY") {
          surrogate.style.display = "block";
          surrogate.focus();
        }
      }
    }, true);

    document.body.insertBefore(surrogateContainer, document.body.children[0]);
  }
};
