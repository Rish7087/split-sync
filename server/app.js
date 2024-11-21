const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require('cors');
const expenseRoutes = require('./routes/expenses');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');   // Corrected typo from 'authROutes' to 'authRoutes'
const session = require('express-session');
const MongoStore = require('connect-mongo');
const houseRoutes = require('./routes/house');
const roomRoutes = require('./routes/room');
const expenseListRoute = require('./routes/expenseList');
const passport = require('passport');
require('dotenv').config();  // Load environment variables
require('./passportConfig'); // Import passport configuration

const mongo_URI = process.env.mongo_URI || "mongodb+srv://rishabhsaini40618:Mxy%407087@cluster0.uhyzl.mongodb.net/split-buddies?retryWrites=true&w=majority&appName=Cluster0";
const PORT = process.env.PORT || 8080; // Default to port 8080 if not set

async function main() {
    try {
        await mongoose.connect(mongo_URI);
        console.log("Connected to Database!");
    } catch (error) {
        console.error("Error connecting to Database:", error);
    }
}

main();

const allowedOrigins = [
    'http://localhost:5173',
    'https://splitsyncc.netlify.app'
];

// Middleware configuration
// app.use(cors({
//   origin: process.env.CLIENT_URL,
//   credentials: true
// }));
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true // Allow cookies
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key', // Use environment variable for secret
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: mongo_URI })
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
// app.use((req, res, next) => {
//     console.log(`${req.method} request for '${req.url}'`);
//     next();
//   });
// Route handlers
app.use('/expenses', expenseRoutes);
app.use('/user', userRoutes);
app.use('/auth', authRoutes);
app.use('/house',houseRoutes);
app.use('/expenselist', expenseListRoute)
app.get("/", (req, res) => {
    res.send("Welcome to Split Buddies");
});

  
app.listen(PORT, () => {
    console.log("Server is running at port: " + PORT);
});
