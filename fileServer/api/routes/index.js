const fs = require('fs');
const util = require('util');
const router = require('express').Router();
const cors = require('cors');
const formidable = require('formidable');
const path = require('path');
const uuidv1 = require('uuid/v1');
const { assetsDir, samplesDir } = require('../../config/assets');
const logger = require('../../config/logger');

const readdir = util.promisify(fs.readdir);

router.get('/samples', cors(), (req, res) => {
  readdir(samplesDir)
    .then(files => {
      return res.status(200).json({ samples: files.map(file => `samples/${file}`) });
    })
    .catch(() => {
      res.status(500).json({ mgs: 'error while reading sample files' });
    });
});

router.post('/upload', cors(), (req, res) => {
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
