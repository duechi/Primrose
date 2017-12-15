import BrowserEnvironment from "../../../src/Primrose/BrowserEnvironment";

const env = new Primrose.BrowserEnvironment({
  backgroundColor: 0x000000,
  useFog: true,
  drawDistance: 100,
  fullScreenButtonContainer: "#fullScreenButtonContainer",
  fullScreenElement: document.body,
  nonstandardNeckLength: 0.15,
  nonstandardNeckDepth: 0.075
});
