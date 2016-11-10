const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcrypt-nodejs');

// =================
// TELL MONGOOSE WHAT A "user" IS:
// e-mail, password
// Type: JavaScript String
/* MongoDB does NOT enforce checking case!
That is:
stephen@gmail.com and
STEPHEN@GMAIL.COM and
STEPHEN@gmail.com
would ALL BE "DIFFERENT".
They would get past our Unique requirement.
So:
Do Mongoose's "lowercase: true" to store them all as lowercase. (Hmm.)
*/
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String, // extra comma okay? here's hopin'
});

// On Save Hook - encrypt that password!
// BEFORE Saving a model - run this function:
userSchema.pre('save', function(next) {
  // user is now an INSTANCE!
  // user.email etc.
  const user = this;

  // generate a salt - ASYNCH!
  // Needs callback:
  bcrypt.genSalt(10, function(err, salt) {
    if (err) { return next(err); }

    // hash (encrypt) our password using the salt
    /*
password:
$2a$10$/NCkT1BlhLKE4VaQ7anEO.vRfNeTInjwziA3tuUwoqgu9Mla6V8NO

Contains both SALT and HASHED PASSWORD
$2a$10$/
NCkT1BlhLKE4VaQ7anEO.vRfNeTInjwziA3tuUwoqgu9Mla6V8NO
    */
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) { return next(err); }

      // Overwrite plain text pw with encrypted! :o)
      user.password = hash;
      // Go ahead now and save ...
      next();
    })
  })
});



// =================
// Create the model class
// Load the Schema into Mongoose. It's about a user.
// Corresponds to a MongoDB "collection" "user"
// IS A CLASS. Not a user
const ModelClass = mongoose.model('user', userSchema);

// =================
// Export the model
module.exports = ModelClass;
