const express = require("express");
const mongoose = require("mongoose");
const Recipe = require("../models/recipe")
const router = express.Router();
const multer = require('multer');
const fs = require("fs");
const Category = require('../models/category');

const upload = multer({
    dest: 'uploads/',
  });

let recipes = [];
let recipe = {
  "instructions": [
    "preheat oven 225C",
    "slice mozzarellas",
    "put tomato sauce on pizza base",
    "put mozzarella slices on pizza",
    "bake for 15 min",
    "Meanwhile, make the sauce"
  ],
  "ingredients": [
    "1 frozen pizza base",
    "1 tomato sauce",
    "2 mozzarellas"
  ],
  "name": "Pizza"
}


fs.readFile("./data/recipes.json", "utf-8", (err, data)=>{
    if(err){
        console.log(err);
        return;
    }
    recipes = JSON.parse(data);
    console.log("data loaded");
})

router.get("/", async (req, res, next) => {
    res.render("index",{recipe});
  });
  

  router.get('/recipe/:food', async (req, res) => {
    try {
      const food = req.params.food;
      const recipes = await Recipe.find({ name: { $regex: food, $options: 'i' } });
      if (recipes.length > 0) {
        recipe = recipes[0];
        return res.json(recipes);
      } else {
        return res.status(404).json({ message: 'No recipes found for this food' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch recipes', error: error.message });
    }
  });
  
  router.get('/categories', async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
    }
  });

  router.put('/recipes/:name/categories', async (req, res) => {
    const { name } = req.params;
    const { categoryIds } = req.body; 
  
    try {
      await Recipe.findByIdAndUpdate(name, { categories: categoryIds });
      res.status(200).json({ message: 'Recipe categories updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update recipe categories', error: error.message });
    }
  });
  

  router.post('/recipe/', (req, res, next) => {
    try {
      const { name, instructions, ingredients } = req.body;
  
      const newRecipe = new Recipe({
        instructions,
        ingredients,
        name
      }).save()
  
      res.status(201).json({ message: 'Recipe created successfully', recipe: newRecipe });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create recipe', error: error.message });
    }
  });

  router.post('/images', upload.array('images'), (req, res) => {
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).send('No images were uploaded.');
    }
  
    res.send("Hi");
  });

  router.get('/new_recipe', (req, res) => {
    res.send(recipes[nameaux]);
  });

module.exports = router;