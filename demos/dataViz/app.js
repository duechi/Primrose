var env = new Primrose.BrowserEnvironment({
  backgroundColor: 0x000000,
  groundTexture: "../shared_assets/images/deck.png",
  drawDistance: 100,
  fullScreenButtonContainer: "#fullScreenButtonContainer",
  nonstandardNeckLength: 0.15,
  nonstandardNeckDepth: 0.075,
  gravity: 0,
  plugins: [
    new Primrose.Plugin.Fog()
  ]
});
