const Authentication = require('./controllers/authentication');

// the configuration for passport service:
const passportService = require('./services/passport');

const passport = require('passport');


// Passport will default to create cookie session; we tell it not to:
const requireAuth = passport.authenticate('jwt', { session: false });

const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {


  // GET /
  /* req = REQUEST HTTP
  res = RESPONSE ... plain JSON ...
  next = error handling
  */

  // app.get('/', function(req, res, next) {
  //   res.send(['abc','tennis','lordy']);
  // });


  app.get('/', requireAuth, function(req, res) {
    // res.send(['requireAuthIGuess:)abc','tennis','lordy']);
    res.send( { message: 'Super-duper secret code is (if you must know) ABC123f'});
  });
  // Your GET must have a Token
  // You obtain it, using RESTful Client, by steps below
  // If you don't have a Token: "Unauthorized"

  app.post('/signin', requireSignin, Authentication.signin)
  // Your POST must have an email and a password
  // You'll get back a Token
  // Note: the above is all SERVER-based, all RESTful Client. Not browser.
  // In RESTful client we manually enter an email, password as Headers
  // For BROWSER client U/I, GET /signin would need to allow anonymous
  //    to get to the signin form, enter email, enter password

  app.post('/signup', Authentication.signup);
  // Your POST must have an email and a password
  // You'll get back a Token
  // Note: the above is all SERVER-based, all RESTful Client. Not browser.
  // In RESTful client we manually enter an email, password as Headers
  // For BROWSER client U/I, GET /signup would need to allow anonymous
  //    to get to the signup form, enter email, enter (create) password

}
