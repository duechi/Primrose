import BasePlugin from "../BasePlugin";
import ModelFactory from "./ModelFactory";

export default class ModelFactoryPlugin extends BasePlugin {

  constructor (modelName, options) {
    super(options);
  }

  get requirements() {
    return [];
  }

  _install(env) {
    return ModelFactory.loadModel(this.options.modelFile)
      .then((template) =>
        env[this.options.name] = template);
  }
}
