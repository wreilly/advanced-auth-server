// authenticate a user, with passport

const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

/* *********
=======================
1. Signing Up
Verify e-mail is not in use
Store (salt/hash) new, first-time password
Send Token


2. Signing In
Verify e-mail and password
Send Token

3. Authenticated Request
Verify Token presented
Send (them) to the resource/page, allow access
=======================
 **********
*/

// 0. LOCAL Passport strategy -
// Expects 'username' and 'password'
// Specify where to find usernameField and password
const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy( localOptions, function(email, password, done) {
  // Verify this email and password
  // If ok, call done with the user
  // Otherwise, call done with false
  User.findOne( { email: email }, function(err, user) {
    if(err) { return done(err); }
    if(!user) { return done(null, false); }

    // Okay, found user ...
    // ... now: compare passwords - is `password` equal to user.password ?
    // Over on /models/user.js we added a method:
    user.comparePassword(password, function(err, isMatch) {
      if(err) { return done(err); }
      if(!isMatch) { return done(null, false); }
      
      // Okay, password is good!
      // user here gets assigned, by Passport, to req.user
      //  That we will use over on authentication.js signin method...
      return done(null, user);
    });


  });
});


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
passport.use(localLogin);
