/*
pliny.function({
  parent: "Flags",
  name: "isLandscape",
  returns: "Boolean",
  description: `Indicates whether or not the phone has been flipped to landscape mode.

NOTE: unlike the other flags in this namespace, this is a function, not a raw boolean value.`
});
*/

export default function isLandscape() {
  return Math.abs(window.orientation) === 90;
};
