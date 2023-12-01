const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let imageSchema = new Schema({
    buffer: Buffer,
    mimetype: String,
    name: String,
    encoding: String
  });

module.exports = mongoose.model("Image", imageSchema);