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
let categories = [{"name": "hola"}];




fs.readFile("./data/recipes.json", "utf-8", (err, data)=>{
    if(err){
        console.log(err);
        return;
    }
    recipes = JSON.parse(data);
    console.log("data loaded");
})

router.get("/", async (req, res, next) => {
  const categories2 = await Category.find();
      categories = categories2;
    res.render("index",{recipe,categories});
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
      const categories2 = await Category.find();
      categories = categories2;
      res.json(categories2);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
    }
  });

  router.post('/categories/', (req, res) => {
    try {
      const { name } = req.body;
  
      const newCategory = new Category({
        name
      }).save()
  
      res.status(201).json({ message: 'category created successfully', categories: newCategory });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create category', error: error.message });
    }
  
    
  });
  

  router.post('/recipe/', (req, res, next) => {
    try {
      const { name, instructions, ingredients, categories } = req.body;
  
      const newRecipe = new Recipe({
        instructions,
        ingredients,
        name,
        categories
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