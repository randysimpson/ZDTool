// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var sfdcSchema = new Schema({
    caseNumber: { type: Number, required: true, unique: true },
    subject: String,
    description: String,
    status: String,
    created: { type: Date},
    updated: { type: Date},
    customerName: String,
    engineer: String,
    priority: String,
    recordID: String,
    resolution: String,
    url: String,
    ticketID: Schema.Types.ObjectId,
    raw_subject: String,
    raw_description: String
});

// the schema is useless so far
// we need to create a model using it
var Sfdc = mongoose.model('Sfdc', sfdcSchema);

// make this available to our users in our Node applications
module.exports = Sfdc;
