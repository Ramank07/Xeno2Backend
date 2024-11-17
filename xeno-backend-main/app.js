const express = require("express");
const passport = require("passport");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const segmentRoutes = require("./routes/segment");
const sequelize = require("./sequelize");
const cors = require('cors')
const session = require('express-session');
require("dotenv").config();
const app = express();

console.log("PROJECT HAS STARTED")
console.log(process.env.GOOGLE_CLIENT_ID)


// Middleware
app.use(express.json());
app.use(cors());



app.use(session({
  secret: process.env.SESSION_SECRET || 'x',
  resave: false,
  saveUninitialized: true,
}));




app.use(passport.initialize());
app.use(passport.session());


// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/segment", segmentRoutes);



// Test Database Connection and Sync
sequelize
  .authenticate()
  .then(() => console.log("Database connected..."))
  .then(() => sequelize.sync()) // Sync models with database
  .catch((err) => console.log("Error: " + err));
// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
