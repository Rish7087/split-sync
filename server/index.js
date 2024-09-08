const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require('cors');
const expenseRoutes = require('./routes/expenses');

const mongo_URI = "mongodb://localhost:27017/split-buddies";
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
app.use('/api/expenses', expenseRoutes);


app.get("/", (req,res)=> {
    res.send("Welcome to split buddies");
})

app.listen(PORT, ()=>{
    console.log("Server is running at port: " + PORT);
})