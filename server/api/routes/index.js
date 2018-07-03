const router = require("express").Router();
const upload = require("../helpers/multer");

router.post("/upload", upload.single("file"), (req, res) => {
  const { fileName } = req.body;
  if (fileName) res.status(200).json({ fileName });
});

module.exports = router;
