const express = require("express");
const router = express.Router();
const fs = require("fs");
const { IMG_DIR } = require('../tensor/processingModule');
const IMG_NUMBER = 4;

router.get("/random", (req, res) => {
  fs.readdir(IMG_DIR, (err,files) => {
    if(err){
      res.send([])
    } else {
      const chooser = randomNoRepeats(files);
      let images = [];
      for(let i = 0; i < IMG_NUMBER; i++){
        images.push(chooser());
      }
      res.send(images);
    }
  });
});

const randomNoRepeats = (array) => {
  let copy = array.slice(0);
  return () => {
    if (copy.length < 1) { copy = array.slice(0); }
    const index = Math.floor(Math.random() * copy.length);
    const item = copy[index];
    copy.splice(index, 1);
    return item;
  };
}

module.exports = router;
