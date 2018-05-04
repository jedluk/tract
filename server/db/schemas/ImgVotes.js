const mongoose = require("mongoose");

const ImgSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  like: {
    type: [String],
    trim: true
  },
  love: {
    type: [String],
    trim: true
  },
  smile: {
    type: [String],
    trim: true
  }
});

const ImgVotes = mongoose.model('ImgVotes', ImgSchema);

module.exports = { ImgVotes };
