import EntityManager from "./EntityManager";

import BaseServerPlugin from "./BaseServerPlugin";

const rpcQueue = [];

function pq() {
  rpcQueue.push.apply(rpcQueue, arguments);
  rpcQueue.push("END");
}

function recv(ent, arr, i) {
  ent.position.fromArray(arr, i + 1);
  ent.quaternion.fromArray(arr, i + 4);
  ent.velocity.fromArray(arr, i + 8);
  ent.angularVelocity.fromArray(arr, i + 11);
  ent.updateMatrix();
  ent.commit();
  return i + 14;
}

export default class InWorkerThreadServer extends BaseServerPlugin {
  constructor(options) {
    super((name) => pq.bind(null, name), options);

    this._workerReady = true;
    this._worker = new Worker(this.options.workerPath);
    this._worker.onmessage = (evt) => {
      const arr = evt.data;
      let i = 0;
      while(i < arr.length) {
        const id = arr[i],
          ent = EntityManager.entityDB[id];
        if(ent) {
          i = recv(ent, arr, i);
        }
      }
      this._workerReady = true;
    };
  }

  start() {
    this._worker.postMessage("start");
  }

  stop() {
    this._worker.postMessage("stop");
  }

  preUpdate(env, dt) {
    if(this._workerReady) {
      super.preUpdate(env, dt);
      if(rpcQueue.length > 0) {
        this._workerReady = false;
        this._worker.postMessage(rpcQueue);
        rpcQueue.length = 0;
      }
    }
  }
}
