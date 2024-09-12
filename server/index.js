const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require('cors');
const expenseRoutes = require('./routes/expenses');
const userRoutes = require('./routes/user');
const itemRoutes = require('./models/item');
const multer = require('multer');
const { storage } = require('./cloudConfig');
const upload = multer({ storage });
require('dotenv').config();  // Add this at the top of your main server file (app.js, server.js, etc.)

// const mongo_URI = "mongodb://localhost:27017/split-buddies";
const mongo_URI = "mongodb+srv://rishabhsaini40618:Mxy%407087@cluster0.uhyzl.mongodb.net/split-buddies?retryWrites=true&w=majority&appName=Cluster0";
const PORT = 8080;

main().then(()=>{
    console.log("Connected to Database !");
}).catch((error)=>{
    console.log(error);
})

async function main() {
    await mongoose.connect(mongo_URI);
}

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Routes
app.use('/expenses', expenseRoutes);
app.use('/user', userRoutes);
app.use('/items', itemRoutes); 

app.get("/", (req,res)=> {
    res.send("Welcome to split buddies");
})

app.listen(PORT, ()=>{
    console.log("Server is running at port: " + PORT);
})