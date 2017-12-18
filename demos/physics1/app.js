var env = new Primrose.BrowserEnvironment({
  fullScreenButtonContainer: "#fullScreenButtonContainer"
});

for(var i = 0; i < 50; ++i){
  box(Primrose.Random.number(0.1, 0.2))
    .colored(Primrose.Random.color())
    .phys({ mass: 1 })
    .at(
      Primrose.Random.number(-0.5, 0.5),
      Primrose.Random.number(1, 2),
      Primrose.Random.number(-1.5, -2.5))
    .linearDamping(0.5)
    .angularDamping(0.75)
    .on("enter", function() {
      this.velocity.y = Primrose.Random.number(5, 10);
    })
    .addTo(env.scene);
}
