const jwt = require('jwt-simple');
// CLASS. ALL USERS:
const User = require('../models/user');
const config = require('../config');

// Pass in a "user model"
function tokenForUser(user) {
  const timestamp = new Date().getTime();
  // the "key" has to be sub:
  // JWT is a convention, standard
  // sub: means "subject" - who is this token about?
  // JWT iat: is "issued at time"
  return jwt.encode( { sub: user.id, iat: timestamp }, config.secret);
}

// Router: POST /signin   will run this function:
exports.signin = function(req, res, next) {
  // User has already has their e-mail and password Authenticated
  // Q. Huh. And this was How? When? Where?
  // A. In ROUTER.JS the call to this function was *prefaced* by "requireSignin"
  //    "requireSignin" works some Passport 'behind-the-scenes' magic:
  //        passport.authenticate('local', ...) ...

  // So at this poin now we just need to give them a token:
  // req.user is the current user model,
  //   as received from passport.js comparePassword method
  res.send({ token: tokenForUser(req.user) });
}

// Router: POST /signup   will run this function:
exports.signup = function(req, res, next) {

  console.log("WR__ req.body", req.body);
  /* Server listening on  3090
WR__ req.body {} <<<< Empty Obj = ok.
WR__ req.body { email: 'test2@reilly2001.info', password: 'abc1234' }
::1 - - [08/Nov/2016:13:20:01 +0000] "POST /signup HTTP/1.1" 200 18 "-" "-"
  */

// Need to SEND something back!
// I had this commented out, and was TIMING OUT. (sheesh.)
  // res.send( { success: 'true' } );

  // ====================
  // 0. Get your paws on that damned email.
  const email = req.body.email;
  const password = req.body.password;

  // Early Validation!
  // You could go further with e-mail validation etc. ...
  if (!email || !password) {
    return res.status(422).send({
      error: "You must provide both email and password. Gracias."
    });
  }


  // ====================
  // 1. See if a user with given email exists
  // (no dupes!)
  User.findOne( { email: email }, function (err, existingUser) {
    // plain old database connection error
    if(err) { return next(err); }

    // ====================
    // 2. If existing, Return a logic error. Cheers.
    if (existingUser) {
      // 422 = "Unprocessable entity"
      // More HTTP Poetry ...
      return res.status(422).send( {
        error: "Email is already in use!"
      });
    }

    // ====================
    // 3. If does NOT exist - create record
    const user = new User( {
      email: email,
      password: password,
    });

    // 3.A. save user to database!
    user.save(function(err) {
      if (err) { return next(err); }

      // ====================
      // 4. Respond to request - "All set!"
      // res.json(user);
      // above - don't send back their password, kids! (which is on 'user').
      // res.json( { success: true } );

      /*
      Really what we want here is to send back a TOKEN !! !! :)
      */
      res.json({
          token: tokenForUser(user)
        });
/*
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1ODIzYTBiZWMyZTkxYjhkYmMwYzJhNTAiLCJpYXQiOjE0Nzg3Mjk5MTkzMTB9.wjfsy2VWiQtOg4i5qUHHink-qEDjRzeknFryzy3IJeI"
}
*/


      // {
  // "success": true
// }

    });



  });





}
