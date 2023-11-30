const mongoose = require("mongoose");

const Schema = mongoose.Schema;


const categorySchema = new mongoose.Schema({
  name: String,
});

module.exports = mongoose.model("Category", categorySchema);