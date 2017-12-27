import { EventDispatcher } from "three";

export default class InWorkerThreadServer extends EventDispatcher {
  constructor(workerPath) {
    super();
    this._worker = new Worker(workerPath);
    this._worker.onmessage = (msg) =>
      this.emit("data", msg);
  }

  send(arr) {
    this._worker.postMessage(arr);
  }
}