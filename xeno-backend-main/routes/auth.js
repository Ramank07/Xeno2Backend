const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User')
const Client = require('../models/Client')
const Customer = require('../models/Customer')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config(); 
const router = express.Router();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, // Ensure this is not undefined
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ where: { googleId: profile.id } });
        if (!user) {
            user = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
            });
            user = await Client.create({user_id: user.id});
            user = await Customer.create({user_id: user.id});
        }
        return done(null, user);  // Serialize user here
    } catch (error) {
        return done(error, null);
    }
}));

// Serialize user into session
passport.serializeUser((user, done) => {
    done(null, user.id);  // Store only the user ID in the session
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findByPk(id);  // Look up user by ID in the database
        done(null, user);  // Attach the user object to the request
    } catch (err) {
        done(err, null);
    }
});
// Initiate Google Login
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// Handle Google OAuth Callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        });
        res.redirect(`http://localhost:3000?token=${token}`);
    });
module.exports = router;