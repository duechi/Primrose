import CANNON from "cannon";

import dynamicInvoke from "../../util/dynamicInvoke";

import EngineServer from "./EngineServer";

const T = EngineServer.DT * 1000,
  engine = new EngineServer(),
  data = [],
  wasSleeping = {},
  params = [];

let lastTime = null,
  timer = null;

onmessage = (evt) => {
  if(evt.data === "start") {
    if(timer === null) {
      lastTime = performance.now();
      timer = setInterval(ontick, T);
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
    const arr = evt.data;
    let i = 0;
    while(i < arr.length) {
      const name = arr[i++],
        handler = engine[name];
      if(handler) {
        const len = handler.length;
        params.length = len;
        for(let j = 0; j < len; ++j) {
          params[j] = arr[i++];
        }
        handler.apply(engine, params);
      }
    }
  }
};


function ontick() {
  const t = performance.now(),
    dt = 0.001 * (t - lastTime);
  lastTime = t;
  engine.update(dt);

  let i = 0;
  for(let n = 0; n < engine.bodyIDs.length; ++n) {
    const id = engine.bodyIDs[n],
      body = engine.bodyDB[id],
      sleeping = body.sleepState === CANNON.Body.SLEEPING;

    if(!sleeping || !wasSleeping[id]) {
      data[i + 0] = id;
      data[i + 1] = body.position.x;
      data[i + 2] = body.position.y;
      data[i + 3] = body.position.z;
      data[i + 4] = body.quaternion.x;
      data[i + 5] = body.quaternion.y;
      data[i + 6] = body.quaternion.z;
      data[i + 7] = body.quaternion.w;
      data[i + 8] = body.velocity.x;
      data[i + 9] = body.velocity.y;
      data[i + 10] = body.velocity.z;
      data[i + 11] = body.angularVelocity.x;
      data[i + 12] = body.angularVelocity.y;
      data[i + 13] = body.angularVelocity.z;
      i += 14;
    }

    wasSleeping[id] = sleeping;
  }

  postMessage(data);
}
