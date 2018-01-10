import CANNON from "cannon";

import { CommandsByID, CommandsByName } from "./Commands";
import EngineServer from "./EngineServer";
import RPCBuffer from "./RPCBuffer";

const T = EngineServer.DT * 1000,
  engine = new EngineServer(),
  wasSleeping = {},
  params = [],
  returner = { messageID: null };

let lastTime = null,
  timer = null,
  rpc = new RPCBuffer(),
  useTransferables = true;

onmessage = function handleMessage(evt) {
  let msg = evt.data;

  if(msg === "serializablesMode") {
    useTransferables = false;
  }
  else if(msg === "transferablesMode") {
    useTransferables = true;
  }
  else if(msg instanceof ArrayBuffer) {
    rpc.buffer = msg;

    while(rpc.available) {
      const cmd = CommandsByID[rpc.shift()];

      params.length = cmd.params.length;
      for(let j = 0; j < cmd.params.length; ++j) {
        params[j] = rpc.shift();
      }

      cmd.execute(engine, params, 0);
    }

    rpc.rewind();
  }
  else {
    if(typeof msg === "string") {
      msg = JSON.parse(msg)
    }

    if(msg.type === "method") {
      if(msg.name === "start") {
        if(timer === null) {
          lastTime = performance.now();
          timer = setInterval(ontick, T);
        }
      }
      else if(msg.name === "stop") {
        if(timer !== null) {
          clearInterval(timer);
          timer = null;
        }
      }
      else {
        const cmd = CommandsByName[msg.name];
        for(let i = 0; i < msg.params.length; i += cmd.paramTypes.length) {
          cmd.execute(engine, msg.params, i);
        }
      }
    }
  }

  returner.messageID = msg.messageID;
  if(returner.messageID) {
    postMessage(returner);
  }
};

function transfer(id, body) {
  rpc.push(id);
  rpc.push(body.position.x);
  rpc.push(body.position.y);
  rpc.push(body.position.z);
  rpc.push(body.quaternion.x);
  rpc.push(body.quaternion.y);
  rpc.push(body.quaternion.z);
  rpc.push(body.quaternion.w);
  rpc.push(body.velocity.x);
  rpc.push(body.velocity.y);
  rpc.push(body.velocity.z);
  rpc.push(body.angularVelocity.x);
  rpc.push(body.angularVelocity.y);
  rpc.push(body.angularVelocity.z);
}

function serialize(n, id, body) {
  let i = n * 14;
  params[i++] = id;
  params[i++] = body.position.x;
  params[i++] = body.position.y;
  params[i++] = body.position.z;
  params[i++] = body.quaternion.x;
  params[i++] = body.quaternion.y;
  params[i++] = body.quaternion.z;
  params[i++] = body.quaternion.w;
  params[i++] = body.velocity.x;
  params[i++] = body.velocity.y;
  params[i++] = body.velocity.z;
  params[i++] = body.angularVelocity.x;
  params[i++] = body.angularVelocity.y;
  params[i++] = body.angularVelocity.z;
}


function ontick() {
  const t = performance.now(),
    dt = 0.001 * (t - lastTime);
  lastTime = t;
  engine.update(dt);

  if(!useTransferables || rpc.ready) {

    if(!useTransferables) {
      params.length = engine.bodyIDs.length * 14;
    }

    let n = 0;

    for(let i = 0; i < engine.bodyIDs.length; ++i) {
      const id = engine.bodyIDs[n],
        body = engine.bodyDB[id],
        sleeping = body.sleepState === CANNON.Body.SLEEPING;

      if(!sleeping || wasSleeping[id]) {
        if(useTransferables) {
          transfer(id, body);
        }
        else {
          serialize(n, id, body);
        }
        ++n;
      }

      wasSleeping[id] = sleeping;
    }

    if(useTransferables) {
      postMessage(rpc.buffer, [rpc.buffer]);
    }
    else {
      params.length = n * 14;
      postMessage(JSON.stringify(params));
    }
  }
}
