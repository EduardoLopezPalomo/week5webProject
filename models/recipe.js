const mongoose = require("mongoose");

const Schema = mongoose.Schema;

let recipeSchema = new Schema({
    instructions: [String],
    ingredients: [String],
    name: String,
    categories: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category'
    }]
  });

module.exports = mongoose.model("Recipe", recipeSchema);