var env = new Primrose.BrowserEnvironment({
  fullScreenButtonContainer: "#fullScreenButtonContainer"
});

for(var i = 0; i < 25; ++i){
  box(Primrose.Random.number(0.1, 0.2))
    .colored(Primrose.Random.color(4, true), { shadow: true })
    .named("Block" + i)
    .phys({ mass: 1 })
    .at(
      Primrose.Random.number(-0.25, 0.25),
      Primrose.Random.number(1, 100),
      Primrose.Random.number(-1.75, -2.25))
    .drag(0.5)
    .angularDrag(0.75)
    .addTo(env.scene)
    .on("enter", function() {
      this.velocity.y = Primrose.Random.number(5, 10);
    });
}
