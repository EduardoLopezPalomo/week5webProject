const express = require('express');
const app = express();
const axios = require('axios'); 
const path = require("path");
const mongoose = require("mongoose");
const recipeRoutes = require("./api/recipes");
const PORT = "3000";

const mongoDB = "mongodb://127.0.0.1:27017/testdb";

mongoose.connect(mongoDB);
mongoose.Promise = Promise;
const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error"));


app.set('view engine', 'pug');
app.set('views', './public');

app.use(express.json());
app.use(express.urlencoded({extended: false}));




app.use("/", recipeRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
