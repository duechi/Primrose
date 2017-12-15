var env = new Primrose.BrowserEnvironment({
  font: "../shared_assets/fonts/helvetiker_regular.typeface.json",
  backgroundColor: 0x07001f,
  groundTexture: "../shared_assets/images/water.png",
  useFog: true,
  drawDistance: 25,
  gazeLength: 0.25,
  showHeadPointer: isMobile,
  fullScreenButtonContainer: "#fullScreenButtonContainer"
}),

  moon = textured(circle(1, 45), "moon.jpg", {
    unshaded: true,
    useFog: false,
    color: 0xffef9f,
    progress: Preloader.thunk
  }),

  pod = hub();

env.scene.add(pod);
pod.position.set(0, 0, -5);

env.sky.add(moon);
moon.latLng(-30, 30, 7);
moon.lookAt(env.scene.position);

modelPromise = Primrose.Graphics.ModelFactory.loadModel("../shared_assets/models/dolphin.obj", "obj", Preloader.thunk).then((porpoise) =>
  range(3, function(i) {
    var dolphin = porpoise.clone();
    dolphin.castShadow = true;
    dolphin.rotation.set(0, 0, i * 1.1, "ZYX");
    dolphin.position.set(0, 0, -i);
    pod.add(dolphin);
  }));

env.addEventListener("ready", function(){
  modelPromise.then(Preloader.hide);
});

env.addEventListener("update", function(dt) {
  pod.rotation.set(0, 0, performance.now() / 1000, "ZYX");
});
