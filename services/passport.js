// authenticate a user, with passport

const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;


// 1. Set up options for JWT Strategy
const jwtOptions = {
  // JWT, on the request, the token can be in body, headers, URL
  // Specify which:
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  // special JWT property:
  secretOrKey: config.secret
};




// 2. Create JWT Strategy
// payload is DECODED JWT Token
// { sub: ... , iat: ... }
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {

  // See if the user ID in payload exists in our database
  // If it does, call done with that user!
  // Otherwise call done with no user object.

  User.findById(payload.sub, function(err, user) {
    // database search error, connection error
    if (err) { return done(err, false); }

    if (user) {
      // got response, got user!
      done(null, user);
    } else {
      // got response, but, no user.
      done(null, false);
    }

  });

});


// 3. Tell Passport to use this strategy
passport.use(jwtLogin);
