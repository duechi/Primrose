const Commands = [
  "addBox",
  "addPlane",
  "addSphere",
  "addSpring",
  "disableAllowSleep",
  "enableAllowSleep",
  "newBody",
  "setAngularDamping",
  "setAngularVelocity",
  "setGravity",
  "setLinearDamping",
  "setPosition",
  "setQuaternion",
  "setVelocity"
], CommandIDs = {};

for(let i = 0; i < Commands.length; ++i) {
  CommandIDs[Commands[i]] = i;
}

function checkCommands(obj, reqs = []) {
  for(let i = 0; i < Commands.length; ++i) {
    const cmd = Commands[i];
    if(typeof obj[cmd] !== "function") {
      reqs.push("Physics server plugin does not implement command: " + cmd);
    }
  }
  return reqs;
}

export {
  checkCommands,
  Commands,
  CommandIDs
};
