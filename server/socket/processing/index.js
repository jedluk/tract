const path = require("path");
const fs = require("fs");
const uuidv4 = require("uuid/v4");
const logger = require("../../config/logger");
const HERE = __dirname;
const UPLOADS_DIR = path.join(HERE, "..", "..", "uploads");
const GALLERY = path.join(
  HERE,
  "..",
  "..",
  "..",
  "client",
  "public",
  "img",
  "gallery"
);

function loadImages(grayName, colorName, cb) {
  grayName = path.join(UPLOADS_DIR, grayName);
  colorName = path.join(UPLOADS_DIR, colorName);
  fs.readFile(grayName, "base64", (err, grayImg) => {
    if (err) throw err;
    fs.readFile(colorName, "base64", (err, colorImg) => {
      if (err) throw err;
      var data = {json: {gray: grayImg, color: colorImg}};
      cb(data);
      cleanUp([colorName, grayName]);
    });
  });
};

function saveImage(data, cb) {
  const outImgName = `${uuidv4().slice(0, 8)}.jpg`;
  outImgPath = path.join(GALLERY, outImgName)
  var image = new Buffer(data, "base64")
  fs.writeFile(outImgPath, image, (err) => {
    if (err) throw err;
    cb(outImgName);
  });
};

const cleanUp = files => {
  files.forEach(file => {
    fs.unlink(file, err => {
      if (err) logger.error(err);
      logger.info(`${file} has been removed`);
    });
  });
};

module.exports = {loadImages, saveImage};
