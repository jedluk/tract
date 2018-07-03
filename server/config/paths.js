const Promise = require('bluebird').Promise;
const fs = require("fs");
const path = require("path");
const logger = require('./logger');
const HERE = __dirname;

const checkPaths = () => {
  const assetsDir = path.join(HERE, "..", "uploads");
  // const readyImgDir = path.join(assetsDir, "ready");
  if (!fs.existsSync(assetsDir)) {
    createDir(assetsDir, "Could not create upload directory");
    // createDir(readyImgDir, "Could not create assets directory");
  } 
  // else if (!fs.existsSync(readyImgDir)) {
  //   createDir(readyImgDir, "Could not create assets directory");
  // }
};

const createDir = (dir, errorMsg) => {
  fs.mkdir(dir, err => {
    if (err) logger.error(errorMsg);
  });
};

module.exports = checkPaths;
