var env = new Primrose.BrowserEnvironment({
  backgroundColor: 0x000000,
  groundTexture: "../shared_assets/images/deck.png",
  drawDistance: 100,
  fullScreenButtonContainer: "#fullScreenButtonContainer",
  fullScreenElement: document.body,
  nonstandardNeckLength: 0.15,
  nonstandardNeckDepth: 0.075,
  plugins: [
    new Primrose.Plugin.Fog()
  ]
});
