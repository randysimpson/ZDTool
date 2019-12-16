// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var bowSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  bow: Schema.Types.Mixed
});

// the schema is useless so far
// we need to create a model using it
var Bow = mongoose.model('bow', bowSchema);

// make this available to our users in our Node applications
module.exports = Bow;