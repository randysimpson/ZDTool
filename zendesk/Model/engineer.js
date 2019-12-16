// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var engineerSchema = new Schema({
    name: String,
    id: { type: Number, required: true, unique: true },
    team: String,
    geo: String,
    customName: String
});

// the schema is useless so far
// we need to create a model using it
var Engineer = mongoose.model('Engineer', engineerSchema);

// make this available to our users in our Node applications
module.exports = Engineer;