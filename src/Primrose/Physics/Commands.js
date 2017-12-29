function cmd() {
  const params = Array.prototype.slice.call(arguments),
    name = params.splice(0, 1);
  return { name, params };
}

const Commands = [
  cmd("addBox", "Int32", "Float64", "Float64", "Float64"),
  cmd("addPlane", "Int32"),
  cmd("addSphere", "Int32", "Float64"),
  cmd("addSpring", "Int32", "Int32", "Float64", "Float64", "Float64"),
  cmd("disableAllowSleep"),
  cmd("enableAllowSleep"),
  cmd("newBody", "Int32", "Float64", "Int32"),
  cmd("setAngularDamping", "Int32", "Float64"),
  cmd("setAngularVelocity", "Int32", "Float64", "Float64", "Float64"),
  cmd("setGravity", "Float64"),
  cmd("setLinearDamping", "Int32", "Float64"),
  cmd("setPosition", "Int32", "Float64", "Float64", "Float64"),
  cmd("setQuaternion", "Int32", "Float64", "Float64", "Float64", "Float64"),
  cmd("setVelocity", "Int32", "Float64", "Float64", "Float64")
], CommandIDs = {};

for(let i = 0; i < Commands.length; ++i) {
  CommandIDs[Commands[i].name] = i;
}

function checkCommands(obj, reqs = []) {
  for(let i = 0; i < Commands.length; ++i) {
    const cmd = Commands[i],
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
  Commands,
  CommandIDs
};
