import CANNON from "cannon";

import dynamicInvoke from "../../util/dynamicInvoke";

import { Commands } from "./Commands";
import EngineServer from "./EngineServer";
import RPCBuffer from "./RPCBuffer";

const T = EngineServer.DT * 1000,
  engine = new EngineServer(),
  wasSleeping = {},
  params = [];

let lastTime = null,
  timer = null,
  rpc = null;

onmessage = (evt) => {
  if(evt.data === "start") {
    if(timer === null) {
      lastTime = performance.now();
      timer = setInterval(ontick, T);
    }
  }
  else if(evt.data === "stop") {
    if(timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  }
  else {
    if(rpc === null) {
      rpc = new RPCBuffer(evt.data);
    }
    else {
      rpc.buffer = evt.data;
    }

    while(rpc.available) {
      const cmdID = rpc.remove(),
        cmd = Commands[cmdID],
        handler = engine[cmd.name];
      if(handler) {
        params.length = cmd.params.length;
        for(let j = 0; j < cmd.params.length; ++j) {
          params[j] = rpc.remove();
        }
        handler.apply(engine, params);
      }
    }

    rpc.rewind();
  }
};


function ontick() {
  const t = performance.now(),
    dt = 0.001 * (t - lastTime);
  lastTime = t;
  engine.update(dt);

  if(rpc && rpc.ready) {
    for(let n = 0; n < engine.bodyIDs.length; ++n) {
      const id = engine.bodyIDs[n],
        body = engine.bodyDB[id],
        sleeping = body.sleepState === CANNON.Body.SLEEPING;

      if(!sleeping || !wasSleeping[id]) {
        rpc.add(id);
        rpc.add(body.position.x);
        rpc.add(body.position.y);
        rpc.add(body.position.z);
        rpc.add(body.quaternion.x);
        rpc.add(body.quaternion.y);
        rpc.add(body.quaternion.z);
        rpc.add(body.quaternion.w);
        rpc.add(body.velocity.x);
        rpc.add(body.velocity.y);
        rpc.add(body.velocity.z);
        rpc.add(body.angularVelocity.x);
        rpc.add(body.angularVelocity.y);
        rpc.add(body.angularVelocity.z);
      }

      wasSleeping[id] = sleeping;
    }

    postMessage(rpc.buffer, [rpc.buffer]);
  }
}

postMessage("ready");
