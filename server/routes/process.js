const express = require("express");
const fs = require("fs");
const router = express.Router();
const path = require("path");
const { processImage } = require("../tensor/processingModule");
const DOCKER_IS_NOT_WORKING = 1;

router.get("/process", (req, res) => {
  if (DOCKER_IS_NOT_WORKING) {
    setTimeout(() => {
      res.send({
        outImg: 'img1.jpg'
      })
    }, 5000);
  } else {
    const { grayImg, colorImg, outImg } = req.query;
    console.log(`Parameters requested: ${grayImg} , ${colorImg} , ${outImg}`);
    processImage(grayImg, colorImg, outImg)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.send(err);
      });
  }
});

module.exports = router;
