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

const userSchema = new mongoose.Schema({
    username : String,
    email : String,
    password : String

});

const user = mongoose.model("user", userSchema);

// middleware to ensure the JWT
const verifyToken  = (req, res, next) =>{
const token = req.headers['auth_token'];
if(!token) return res.status(401).send("INVALID AUTHORIZATION");

jwt.verify(token,'pulkits secret', (err, decoded)=>{
    if(err) return res.status(401).send("WRONG CREDENTIAL");
    req.user = decoded;
    next();
})
}

// Parses incoming JSON requests so that get req.body data
app.use(express.json());

//chect get request
app.get('/api', (req, res)=>{
    res.status(201).send("checked");
})

//signup POST route
app.post('/api/signup', async (req, res)=>{
    try {
        const existingUser = await user.findOne({email : req.body.email});
        if(existingUser) return res.status(400).send("Email already exists");

        //using bcrypt to hash the password with salt value of 10
        const hashedPassword = await bcryptjs.hash(req.body.password, 10);

        // creating the new user
        const newUser = new user({
            username : req.body.username,
            email : req.body.email,
            password : hashedPassword
        });

        await newUser.save();
        res.status(201).send("Signup successfully");
    } catch(err){
        res.status(500).send("Internal server error");
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});