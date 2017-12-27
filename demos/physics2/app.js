var env = new Primrose.BrowserEnvironment({
    fullScreenButtonContainer: "#fullScreenButtonContainer",
    gravity: 0
  }),

  center = hub()
    .phys({mass: 0})
    .addTo(env.scene)
    .at(0, 1.5, -3);

for(var i = 0; i < 50; ++i){
  var a = sphere(Primrose.Random.number(0.1, 0.2), 20, 20)
    .colored(Primrose.Random.color())
    .phys({ mass: i + 1 })
    .addTo(env.scene)
    .at(
      Primrose.Random.number(-0.5, 0.5),
      Primrose.Random.number(1, 2),
      Primrose.Random.number(-1.5, -2.5))
    .vel(
      Primrose.Random.number(-1, 1),
      Primrose.Random.number(-1, 1),
      Primrose.Random.number(-1, 1))
    .drag(0.5)
    .angularDrag(0.75)
    .on("enter", function() {
      this.velocity.y = Primrose.Random.number(5, 10);
    });

  spring(center, a, {
    restLength: 1,
    stiffness: 500,
    drag: 5
  });
}
