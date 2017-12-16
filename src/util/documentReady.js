export default new Promise((resolve, reject) => {
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
