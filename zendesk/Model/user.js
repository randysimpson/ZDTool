// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

// create a schema
var userSchema = new Schema({
    name: String,
    username: { type: String },
    salt: { type: String },
    password: { type: String },
    admin: Boolean,
    email: { type: String, required: true, unique: true },
    created: Date,
    modified: Date,
    confluenceID: String
});

var generateHash = function(salt, password) {
  var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  return hash.digest('hex');
}

userSchema.methods.savePassword = function(password, callback) {
  var length = 24;
  //generate the salt.
  this.salt = crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
  //now save the password.
  this.password = generateHash(this.salt, password);
  callback(null, this.password);
};

userSchema.methods.checkPassword = function(password, callback) {
  var passHash = generateHash(this.salt, password);
  callback(null, this.password == passHash);
};

userSchema.pre('save', function(next) {
  var currentDate = new Date();

  this.modified = currentDate;

  if(!this.created)
    this.created = currentDate;

  if(this.password) {
    this.savePassword(this.password, function(err, result) {
      if(err)
        throw err;

      next();
    });
  } else {
    next();
  }
});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;