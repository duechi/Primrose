import BasePlugin from "../BasePlugin";

export default class InWorkerThreadServer extends BasePlugin {
  constructor(options) {
    super("PhysicsServer", options);

    this._worker = new Worker(this.options.workerPath);
    this._worker.onmessage = this.dispatchEvent.bind(this);
  }

  get requirements() {
    return [];
  }

  _install(env) {
    env.physics = this;
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
