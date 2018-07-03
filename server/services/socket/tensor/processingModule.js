const path = require("path");
const fs = require("fs");
const HERE = __dirname;
const ASSETS_DIR = path.join(HERE, "..", "assets");
const IMG_DIR = path.join(HERE, "..", "..","client", "public", "img", "gallery");

processImage = (grayImg, colorImg, outImg) =>
  new Promise((res, rej) => {
    grayImgPath = path.join(ASSETS_DIR, grayImg);
    colorImgPath = path.join(ASSETS_DIR, colorImg);
    outImgPath = path.join(IMG_DIR, outImg);

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
      cleanUp([colorImgPath, grayImgPath]);
      if (data.toString().trim() === "image saved") {
        res({
          outImg,
          data: data.toString()
        });
      }
    });

    process.stderr.on("data", data => {
      cleanUp([colorImgPath, grayImgPath]);
      console.log(`Error during executing python script ${data.toString()}`);
      rej(data.toString());
    });
  });

const cleanUp = files => {
  files.forEach(file => {
    fs.unlink(file, () => console.log(`${file} has been removed`));
  });
};

module.exports = {
  IMG_DIR,
  processImage
};
