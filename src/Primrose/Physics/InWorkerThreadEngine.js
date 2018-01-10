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

    this._nextMessageID = 1;
    this._resolvers = {};
    this._worker = new Worker(this.options.workerPath);
    this._worker.onmessage = (evt) => {
      const messageID = evt.data.messageID;
      if(messageID) {
        const resolver = this._resolvers[messageID];
        if(resolver) {
          delete this._resolvers[messageID];
          resolver(evt.data);
        }
      }
      else {
        this._onmessage(evt);
      }
    };
  }

  _install(env) {
    this.entities = env.entities;
    return super._install(env);
  }

  post(data, transfer) {
    return new Promise((resolve, reject) => {
      data.messageID = this._nextMessageID++;
      this._resolvers[data.messageID] = resolve;
      this._worker.postMessage(JSON.stringify(data));
    });
  }

  start() {
    return this.post(WorkerCommands.start)
      .then(() => this._onstarted())
      .then(() => super.start());
  }

  _onstarted() {
  }

  stop() {
    return this.post(WorkerCommands.stop);
  }
};
