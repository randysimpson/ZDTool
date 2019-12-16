// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var zduserSchema = new Schema({
  name: String,
  id: { type: Number, required: true, unique: true },
  url: { type: String },
  created_at: { type: Date},
  email: String,
  organization_id: Number,
  role: String  //agent = engineer
});

// the schema is useless so far
// we need to create a model using it
var ZDUser = mongoose.model('ZDUser', zduserSchema);

// make this available to our users in our Node applications
module.exports = ZDUser;