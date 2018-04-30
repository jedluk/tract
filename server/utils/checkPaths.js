const fs = require("fs");
const path = require("path");
const HERE = __dirname;

const checkPaths = () => {
  const assetsDir = path.join(HERE, "..", "assets");
  const readyImgDir = path.join(assetsDir, "ready");
  if (!fs.existsSync(assetsDir)) {
    createDir(assetsDir, "Could not create assets directory");
    createDir(readyImgDir, "Could not create assets directory");
  } else if (!fs.existsSync(readyImgDir)) {
    createDir(readyImgDir, "Could not create assets directory");
  }
};

const createDir = (dir, errorMsg) => {
  fs.mkdir(dir, err => {
    if (err) {
      console.log(errorMsg);
    }
  });
};

module.exports = { checkPaths };
