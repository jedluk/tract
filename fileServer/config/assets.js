const util = require('util');
const path = require('path');
const fs = require('fs');
const logger = require('./logger');
const HERE = __dirname;

const mkdir = util.promisify(fs.mkdir);

const ASSETS_DIR =
  process.env.NODE_ENV === 'production'
    ? path.join(HERE, '..', 'assets')
    : path.join(HERE, '..', '..', 'assets-volume');
const GALLERY_DIR = path.join(ASSETS_DIR, 'gallery');

const checkPaths = async () => {
  if (!isDir(ASSETS_DIR)) {
    await mkdir(ASSETS_DIR);
    logger.info(`created assets dir in ${ASSETS_DIR}`);
  }
  if (!isDir(GALLERY_DIR)) {
    await mkdir(path.join(ASSETS_DIR, 'gallery'));
    logger.info(`created gallery dir in ${GALLERY_DIR}`);
  }
};

const isDir = path => {
  try {
    fs.lstatSync(path).isDirectory();
    return true;
  } catch {
    return false;
  }
};

module.exports = { checkPaths, assetsDir: ASSETS_DIR };
