class Command {
  constructor(name, id, paramTypes) {
    this.id = id;
    this.type = "method";
    this.messageID = null;
    this.name = name;
    if(paramTypes) {
      this.paramTypes = paramTypes;
      this.params = new Array(paramTypes.length);
    }
    else {
      this.paramTypes = null;
      this.params = null;
    }
  }

  execute(context, parameters, offset) {
    if(this.params) {
      const handler = context[this.name];
      if(handler) {
        for(let i = 0; i < this.paramTypes.length; ++i) {
          this.params[i] = parameters[i + offset];
        }
        return handler.apply(context, this.params);
      }
    }
  }
}

const CommandsByName = {}, CommandsByID = [
  ["addBox", "Int32", "Float64", "Float64", "Float64"],
  ["addPlane", "Int32"],
  ["addSphere", "Int32", "Float64"],
  ["addSpring", "Int32", "Int32", "Float64", "Float64", "Float64"],
  ["disableAllowSleep"],
  ["enableAllowSleep"],
  ["newBody", "Int32", "Float64", "Int32"],
  ["removeBody", "Int32"],
  ["setAngularDamping", "Int32", "Float64"],
  ["setGravity", "Float64"],
  ["setLinearDamping", "Int32", "Float64"],
  ["setPhysicsState", "Int32",
    "Float64", "Float64", "Float64",
    "Float64", "Float64", "Float64", "Float64",
    "Float64", "Float64", "Float64",
    "Float64", "Float64", "Float64"]
].map((arr, i) => {
  const name = arr.shift();
  return (CommandsByName[name] = new Command(name, i, arr));
});



function checkCommands(obj, reqs = []) {
  for(let i = 0; i < CommandsByID.length; ++i) {
    const cmd = CommandsByID[i],
      handler = obj[cmd.name];
    if(typeof handler !== "function") {
      reqs.push("Physics server plugin does not implement command: " + cmd.name);
    }
    else if(handler.length !== cmd.params.length) {
      reqs.push(`Physics server plugin's implementation of command: ${cmd.name} had ${handler.length} parameters when ${cmd.params.length} were expected.`);
    }
  }
  return reqs;
}

export {
  checkCommands,
  Command,
  CommandsByName,
  CommandsByID
};
