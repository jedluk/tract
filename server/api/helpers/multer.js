const multer = require("multer");
const uuidv4 = require("uuid/v4");
const path = require("path");
const UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const { originalname: name } = file;
    let [core, ext] = splitByLastDot(name);
    const hashedFileName = `${uuidv4().slice(0, 8)}.${ext}`;
    const finalName = core.startsWith("gray")
      ? `gray_${hashedFileName}`
      : hashedFileName;
    req.body.fileName = finalName;
    cb(null, finalName);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.match(/(jpe?g)|(png)|(tif?f)$/)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024
  }
});

const splitByLastDot = text => {
  const index = text.lastIndexOf(".");
  return [text.slice(0, index), text.slice(index + 1)];
};

module.exports = upload;
