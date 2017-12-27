import BaseServerPlugin from "../BaseServerPlugin";

export default class InWorkerThreadServer extends BaseServerPlugin {
  constructor(options) {
    super(options);

    this._worker = new Worker(this.options.workerPath);
    this._worker.onmessage = this.dispatchEvent.bind(this);
  }

  start() {
    this._worker.postMessage("start");
  }

  stop() {
    this._worker.postMessage("stop");
  }

  send(arr) {
    this._worker.postMessage(arr);
  }
}
