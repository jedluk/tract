const path = require("path");
const fs = require("fs");
const HERE = __dirname;
const ASSETS_DIR = path.join(HERE, "..", "assets");
const IMG_DIR = path.join(ASSETS_DIR, '..', '..', 'client', 'public', 'img');

processImage = (grayImg, colorImg, outImg) =>
  new Promise((res, rej) => {
    grayImgPath = path.join(ASSETS_DIR, grayImg);
    colorImgPath = path.join(ASSETS_DIR, colorImg);
    outImgPath = path.join(ASSETS_DIR, "ready", outImg);

    if (!fs.existsSync(grayImgPath) || !fs.existsSync(colorImgPath)) {
      rej("Some of requested files do not exist ... ");
    }

    const { spawn } = require("child_process");
    const process = spawn("python", [
      path.join(HERE, "run.py"),
      `inputGray=${grayImgPath}`,
      `inputColor=${colorImgPath}`,
      `outImg=${outImgPath}`,
      `N=${10}`
    ]);

    console.log(
      `Started processing with params: ${grayImgPath}, ${colorImgPath} , ${outImgPath}`
    );
    process.stdout.on("data", data => {
      if (data.toString().trim() === "image saved") {
        fs.copyFileSync(
          outImgPath,
          path.join(
            __dirname,
            "..",
            "..",
            "client",
            "public",
            "img",
            "ready",
            outImg
          )
        );
        res({
          outImg,
          data: data.toString()
        });
      } else {
        rej(data.toString());
      }
    });

    process.stderr.on("data", data => {
      console.log(`Error during executing python script ${data.toString()}`);
      rej(data.toString());
    });
  });

module.exports = {
  ASSETS_DIR,
  processImage
};
