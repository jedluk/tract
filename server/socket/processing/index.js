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

processImage = (grayImg, colorImg) =>
  new Promise((res, rej) => {
    const outImgName = `${uuidv4().slice(0, 8)}.jpg`;
    grayImg = path.join(UPLOADS_DIR, grayImg);
    colorImg = path.join(UPLOADS_DIR, colorImg);
    outImg = path.join(GALLERY, outImgName);

    if (!fs.existsSync(grayImg) || !fs.existsSync(colorImg)) {
      rej("Some of requested files do not exist ... ");
    }

    const { spawn } = require("child_process");
    const process = spawn("python", [
      path.join(HERE, "run.py"),
      `inputGray=${grayImg}`,
      `inputColor=${colorImg}`,
      `outImg=${outImg}`,
      `N=${10}`
    ]);

    logger.info(
      `Started processing with params: ${grayImg}, ${colorImg} , ${outImg}`
    );
    process.stdout.on("data", data => {
      cleanUp([colorImg, grayImg]);
      if (data.toString().trim() === "image saved") {
        res({ outImgName });
      }
    });

    process.stderr.on("data", data => {
      cleanUp([colorImg, grayImg]);
      logger.error(`Error during executing python script ${data.toString()}`);
      rej(data.toString());
    });
  });

const cleanUp = files => {
  files.forEach(file => {
    fs.unlink(file, err => {
      if (err) logger.error(err);
      logger.info(`${file} has been removed`);
    });
  });
};

module.exports = processImage;
