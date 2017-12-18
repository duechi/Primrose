var gulp = require("gulp"),
  glob = require("glob").sync,
  pkg = require("./package.json"),
  marigold = require("marigold-build").setup(gulp, pkg),

  publicDirs = ["", "demos/**/", "doc/**/"],
  inplace = function(ext){
    return publicDirs.map(function(publicDir) {
      return publicDir + "*." + ext;
    });
  },

  preloaderFiles = ["preloader/**/*.js"],
  srcFiles = ["src/**/*.js"],
  justDemoPugFiles = ["demos/**/*.pug"],
  pugFiles = inplace("pug"),
  stylusFiles = inplace("styl"),
  justDemoStylusFiles = ["demos/**/*.styl"],
  justDemoJSFiles = ["demos/**/*.js", "!demos/**/*.min.js", "!demos/**/src/*.js", "!demos/pacman/pacman.js"],
  htmlFiles = inplace("html"),
  cssFiles = inplace("css"),
  jsFiles = inplace("js"),
  jpgFiles = inplace("jpg"),
  pngFiles = inplace("png"),

  html = marigold.html(pugFiles, {
    watch: ["*.md" ,"doc/**/*.md", "templates/**/*.pug"]
  }),
  justDemoHTML = marigold.html(justDemoPugFiles, {
    name: "primrose:just-demos"
  }),
  css = marigold.css(stylusFiles),
  justDemoCSS = marigold.css(justDemoStylusFiles, {
    name: "primrose:just-demos"
  }),
  images = marigold.images(jpgFiles.concat(pngFiles)),
  minifyDemos = marigold.minify(justDemoJSFiles),

  preloader = marigold.js({
    entry: "preloader/index.js",
    advertise: false,
    disableGenerators: true,
    sourceMap: false
  }),

  demos = glob("demos/*/src/index.js").map((entry) => {
    const name = entry.match(/demos\/(\w+)\/src\/index.js/)[1],
      fileName = entry.replace("src/index.js", "app.js");
    return marigold.js({
      name: "demo_" + name,
      entry,
      fileName,
      advertise: false,
      sourceMap: false,
      extractDocumentation: false,
      format: "umd",
      watchFiles: srcFiles
    });
  }),

  jsBuild = (fmt) => {
    return marigold.js({
      name: "Primrose",
      advertise: true,
      sourceMap: (debug) => debug && fmt === "umd",
      extractDocumentation: (debug) => !debug,
      format: fmt
    });
  },

  jsUMD = jsBuild("umd"),
  jsESModules = jsBuild("es"),

  tidyFiles = [
    "preloader.min.js.map",
    "Primrose.modules.doc.js",
    "Primrose.modules.min.js",
    "Primrose.modules.js.map"
  ],

  stopOnFiles = []
    .concat(pugFiles)
    .concat(stylusFiles)
    .concat(preloaderFiles)
    .concat(srcFiles)
    .concat(["demos/*/src/*.js"]),

  reloadOnFiles = ["!gulpfile.js"]
    .concat(jsFiles)
    .concat(cssFiles)
    .concat(htmlFiles)
    .concat(["demos/*/app.js"]),

  devServer = marigold.devServer(stopOnFiles, reloadOnFiles, {
    debounceDelay: 1500,
    keepOpenOnLastDisconnect: true,
    url: "fx/demos/empty"
  }),

  copyQuickstart = marigold.move(["Primrose.min.js"], "quickstart"),

  tidy = marigold.clean(tidyFiles, [copyQuickstart]);

// simplify some of the tasks to improve performance.
delete jsESModules.default;
// html.default = justDemoHTML.default;
// css.default = justDemoCSS.default;

gulp.task("serve", devServer);

marigold.taskify([
  html,
  css,
  //images,
  preloader,
  jsUMD,
  jsESModules
].concat(demos), {
  default: devServer,
  release() {
    gulp.start(tidy.release);
  }
});
