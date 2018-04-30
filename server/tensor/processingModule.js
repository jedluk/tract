const path = require("path");
const fs = require("fs");

const HERE = __dirname;
const ASSETS_DIR = path.join(HERE, "..", "assets");
const IMAGE_DIR = path.join(ASSETS_DIR, "ready.jpg");

const getTestFile = () => {
  const file = fs.readdirSync(ASSETS_DIR).find(file => /^black_/.test(file));
  return path.join(ASSETS_DIR, file);
};

processImage = () =>
  new Promise((res, rej) => {
    const testFile = getTestFile();
    if (!testFile) {
      rej("No file to process!");
    }

    const { spawn } = require("child_process");
    const process = spawn("python", [
      path.join(HERE, "run.py"),
      `inputColor=${testFile}`,
      `inputGray=${IMAGE_DIR}`,
      `N=${2}`
    ]);

    process.stdout.on("data", data => {
      if (data === "ready") {
        res(data.toString());
      } else {
        rej(data.toString());
      }
    });

    process.stderr.on("data", data => {
      rej(data.toString());
    });
  });

module.exports = {
  ASSETS_DIR,
  IMAGE_DIR,
  processImage
};
