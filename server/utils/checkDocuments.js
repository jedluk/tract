const path = require("path");
const fs = require("fs");
const { ImgVotes } = require("../db/schemas/ImgVotes");

const galleryPath = path.join(
  __dirname,
  "..",
  "..",
  "client",
  "public",
  "img",
  "gallery"
);

const checkDocuments = () => {
  fs.readdir(galleryPath, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach(file => {
        ImgVotes.findOne({ name: file.slice(0, -4) })
          .then(doc => {
            if (!doc) {
              new ImgVotes({
                name: file.slice(0, -4)
              })
                .save()
                .then(doc => console.log(`Doc created!\n${doc}`))
                .catch(err => console.log(err));
            }
          })
          .catch(err => console.log(err));
      });
    }
  });
};

module.exports = { checkDocuments };
