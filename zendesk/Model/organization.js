// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var organizationSchema = new Schema({
  name: String,
  id: { type: Number, required: true, unique: true },
  url: { type: String }
});

// the schema is useless so far
// we need to create a model using it
var Organization = mongoose.model('Organization', organizationSchema);

// make this available to our users in our Node applications
module.exports = Organization;