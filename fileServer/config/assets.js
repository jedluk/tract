const util = require('util');
const path = require('path');
const fs = require('fs');
const logger = require('./logger');
const HERE = __dirname;

const mkdir = util.promisify(fs.mkdir);

const ASSETS_DIR =
  process.env.NODE_ENV === 'production'
    ? path.join(HERE, '..', 'assets')
    : path.join(HERE, '..', '..', 'assets');
const SAMPLES_DIR = path.join(ASSETS_DIR, 'samples');

const checkPaths = async () => {
  if (!isDir(ASSETS_DIR)) {
    await mkdir(ASSETS_DIR);
    logger.info(`created assets dir in ${ASSETS_DIR}`);
  }
  if (!isDir(SAMPLES_DIR)) {
    await mkdir(SAMPLES_DIR);
    logger.info(`created samples dir in ${SAMPLES_DIR}`);
  }
  logger.info(`ASSETS DIR LOCATED HERE: ${ASSETS_DIR}`);
};

const isDir = path => {
  try {
    fs.lstatSync(path).isDirectory();
    return true;
  } catch {
    return false;
  }
};

module.exports = { checkPaths, assetsDir: ASSETS_DIR, samplesDir: SAMPLES_DIR };
