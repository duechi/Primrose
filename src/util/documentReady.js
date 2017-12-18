/*
pliny.value({
  parent: "Util",
  name: "documentReady",
  type: "Promise",
  description: "A promise that is resolved when the `document.readyState` has been set by the browser to \"complete\"."
});
*/
const documentReady = new Promise((resolve, reject) => {
  if (document.readyState === "complete") {
    resolve("already");
  }
  else {
    document.addEventListener("readystatechange", (evt) => {
      if (document.readyState === "complete") {
        resolve("had to wait for it");
      }
    }, false);
  }
});

export default documentReady;
