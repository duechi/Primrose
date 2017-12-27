import EngineServer from "./EngineServer";

let lastTime = null,
  timer = null;

const T = EngineServer.DT * 1000,
  server = new EngineServer((arr) =>
    postMessage(arr));

onmessage = (evt) => {
  if(evt.data === "start") {
    if(timer === null) {
      lastTime = performance.now();
      timer = setInterval(() => {
        const t = performance.now(),
          dt = 0.001 * (t - lastTime);
        lastTime = t;
        server.update(dt);
      }, T);
      console.log("worker timer started", T);
    }
  }
  else if(evt.data === "stop") {
    if(timer !== null) {
      clearInterval(timer);
      timer = null;
      console.log("worker timer stopped");
    }
  }
  else {
    server.recv(evt.data);
  }
};
