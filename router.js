const Authentication = require('./controllers/authentication');

// the configuration for passport service:
const passportService = require('./services/passport');

const passport = require('passport');


// Passport will default to create cookie session; we tell it not to:
const requireAuth = passport.authenticate('jwt', { session: false });

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
    res.send(['requireAuthIGuess:)abc','tennis','lordy']);
  });


  app.post('/signup', Authentication.signup);

}
