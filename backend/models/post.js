const mongoose = require("mongoose");

// schema is a blueprint
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true },
  creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
});

module.exports = mongoose.model("Posts", postSchema);
