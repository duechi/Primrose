/*
pliny.function({
  parent: "Live API",
  name: "cameras",
  returns: "Promise",
  description: "Queries the system for an array of connected camera devices."
});
*/

export default function cameras() {
  return navigator.mediaDevices.enumerateDevices()
    .catch(console.error.bind(console, "ERR [enumerating devices]:>"))
    .then((devices) => devices.filter((d) => d.kind === "videoinput"))
    .catch(console.error.bind(console, "ERR [filtering devices]:>"));
};
