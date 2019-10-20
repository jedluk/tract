const util = require('util');
const path = require('path');
const fs = require('fs');
const HERE = __dirname;

const mkdir = util.promisify(fs.mkdir);

const ASSETS_DIR = path.join(HERE, '..', '..', 'assets');
const GALLERY_DIR = path.join(ASSETS_DIR, 'gallery');

const checkPaths = async () => {
  const dirExists = fs.lstatSync(ASSETS_DIR).isDirectory();
  !dirExists && (await mkdir(ASSETS_DIR));
  const galleryExists = fs.lstatSync(GALLERY_DIR).isDirectory();
  !galleryExists && (await mkdir(path.join(assetsDir, 'gallery')));
};

module.exports = { checkPaths, assetsDir: ASSETS_DIR };
