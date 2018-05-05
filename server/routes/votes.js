const _ = require("lodash");
const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const { ImgVotes } = require("../db/schemas/ImgVotes");

module.export = router.get("/votes/:name", (req, res) => {
  ImgVotes.findOne(({ name } = req.params))
    .then(imgVotes => {
      let { like, love, smile } = imgVotes;
      like = like.length;
      love = love.length;
      smile = smile.length;
      res.send({ like, love, smile });
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

router.patch("/votes/:name", (req, res) => {
  const { name } = req.params;
  const body = _.pick(req.body, ["hash", "social"]);
  update(name, body)
    .then(data => res.send(data))
    .catch(e => res.status(404).send(e));
});

const update = async (name, { social, hash }) => {
  try {
    const imgVotes = await ImgVotes.findOne({ name });
    let { like, love, smile } = imgVotes;
    [like, love, smile].forEach(social => {
      social.forEach((hashElem, idx) => {
        if (hashElem === hash) {
          social.splice(idx, 1);
        }
      });
    });
    switch (social) {
      case "like":
        like.push(hash);
        break;
      case "love":
        love.push(hash);
        break;
      case "smile":
        smile.push(hash);
        break;
    }
    const updated = await ImgVotes.findOneAndUpdate(
      { name },
      { like, love, smile }
    );
    return uploded;
  } catch (err) {
    console.log("cannot update");
  }
};

module.exports = router;
