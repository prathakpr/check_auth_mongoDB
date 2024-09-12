// requiring important modules for the authentication process
const express = require("express");
const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

//creating app instance of expresss
const app = express();
const PORT = 3000; //running on PORT 3000

//connecting to mongo db
mongoose.connect('mongodb://localhost:27017/pulkits_database')
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// doing data modeling of user's details or creating a schema
const schema = mongoose.schema;

const userSchema = new mongoose.Schema({
    username : String,
    email : String,
    password : String

});

const user = mongoose.model("User", userSchema);