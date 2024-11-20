const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/user'); // Adjust path if necessary

// Set up the Google OAuth 2.0 strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'https://split-buddies.onrender.com/auth/google/callback'  
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if a user with this Google ID already exists
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        // Create a new user if none exists
        user = new User({
          googleId: profile.id,
          name: profile.displayName,
          email: profile.emails[0].value,
          profilePic: profile.photos[0].value
        });
        await user.save();
        console.log('New user registered via Google:', user);
      } else {
        console.log('Existing user logged in via Google:', user);
      }
      return done(null, user);
    } catch (err) {
      console.error('Error during Google authentication:', err);
      return done(err, null);
    }
  }));

// Serialize user ID into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (user) {
      console.log('User successfully deserialized:', {
        googleId: user.googleId,
        name: user.name,
        email: user.email
      });
    } else {
      console.log('User not found during deserialization.');
    }
    done(null, user);
  } catch (err) {
    console.error('Error during user deserialization:', err);
    done(err, null);
  }
});
