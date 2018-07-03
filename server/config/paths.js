const Promise = require('bluebird').Promise;
const fs = require("fs");
const path = require("path");
const logger = require('./logger');
const HERE = __dirname;

const checkPaths = () => {
  const assetsDir = path.join(HERE, "..", "uploads");
  if (!fs.existsSync(assetsDir)) {
    createDir(assetsDir, "Could not create upload directory");
  } 
};

const createDir = (dir, errorMsg) => {
  fs.mkdir(dir, err => {
    if (err) logger.error(errorMsg);
    logger.info('Created uploads directory');
  });
};

module.exports = checkPaths;
