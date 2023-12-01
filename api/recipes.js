const express = require("express");
const mongoose = require("mongoose");
const Recipe = require("../models/recipe")
const router = express.Router();
const multer = require('multer');
const fs = require("fs");
const Category = require('../models/category');
const Image = require("../models/images");

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

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
  "name": "Pizza",
  "images":[]
}
let categories = [{"name": "hola"}];
let images = [];



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
  res.render("index",{recipe,categories, images });
  });

  router.get('/recipe/:food', async (req, res) => {
    try {
      const food = req.params.food;
      const recipes = await Recipe.find({ name: { $regex: food, $options: 'i' } });
  
      if (recipes.length > 0) {
        const recipe2 = recipes[0];
        const imageDetails = [];

        for (const imageId of recipe2.images) {
          const image = await Image.findById(imageId);
          console.log(image);
          if (image) {
            imageDetails.push(image);
          }
        }
        recipe = recipe2;
        images = imageDetails;
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
      const { name, instructions, ingredients, categories, images } = req.body;

      const recipeCategories = Array.isArray(categories) ? categories : [];
      const recipeImages = Array.isArray(images) ? images : [];

      const newRecipe = new Recipe({
        instructions,
        ingredients,
        name,
        categories: categories || [],
        images: images  
      }).save()

  
      res.status(201).json({ message: 'Recipe created successfully', recipe: newRecipe });
    } catch (error) {
      res.status(500).json({ message: 'Failed to create recipe', error: error.message });
    }
  });

  router.post('/image/', upload.single('image'), async (req, res) => {
    try {
      const newImage = new Image({
        buffer: req.file.buffer,
        mimetype: req.file.mimetype,
        name: req.file.originalname,
        encoding: req.file.encoding
      });
  
      const savedImage = await newImage.save();
  
      res.status(201).json(savedImage);
    } catch (error) {
      res.status(500).json({ message: 'Failed to upload image', error: error.message });
    }
  });

  router.get('/image/:imageId', async (req, res) => {
    try {
      const imageDetails = await Image.findById(req.params.imageId);
      if (!imageDetails) {
        return res.status(404).json({ message: 'Image not found' });
      }
      res.set('Content-Type', imageDetails.mimetype);
      res.set('Content-Disposition', 'inline');
      res.send(imageDetails.buffer);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch image', error: error.message });
    }
  });
  

  router.get('/new_recipe', (req, res) => {
    res.send(recipes[nameaux]);
  });

  

module.exports = router;