const router = require('express').Router();
const formidable = require('formidable');
const path = require('path');
const uuidv1 = require('uuid/v1');
const { assetsDir } = require('../../config/assets');
const logger = require('../../config/logger');

router.post('/upload', (req, res) => {
  const form = new formidable.IncomingForm();
  let hashName = '';
  form.uploadDir = assetsDir;
  form.maxFileSize = 30 * 1024 * 1024; // 3 MB
  form
    .parse(req)
    .on('error', err => {
      logger.error(`File upload failed, ${err}`);
      res.status(500).json({ msg: 'Internal server error' });
    })
    .on('fileBegin', (name, file) => {
      hashName = uuidv1() + path.extname(file.name);
      logger.info(`Uploading file ${hashName}`);
      file.path = path.join(assetsDir, hashName);
    })
    .on('end', () => {
      res.status(200).json({ fileName: hashName });
    });
});

module.exports = router;
