import BaseEnginePlugin from "./BaseEnginePlugin";

import { Command } from "./Commands";

const WorkerCommands = {
  start: new Command("start"),
  stop: new Command("stop")
};

export default class InWorkerThreadEngine extends BaseEnginePlugin {
  constructor(options) {
    super(options);

    this.entities = null;

    this._worker = new Worker(this.options.workerPath);

    let started = false;
    this._worker.onmessage = (evt) => {
      if(evt.data === "started" && !started) {
        started = true;
        this._onstarted();
      }
      else if(started) {
        this._onmessage(evt);
      }
    };
  }

  _install(env) {
    this.entities = env.entities;

    env.addEventListener("started", () => this.post(WorkerCommands.start));
    env.addEventListener("stopped", () => this.post(WorkerCommands.stop));

    return super._install(env);
  }

  post(data, transfer) {
    this._worker.postMessage(JSON.stringify(data));
  }
};
