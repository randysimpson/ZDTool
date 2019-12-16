// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var helpSchema = new Schema({
    ticket_id: { type: Number, required: true, unique: true },
    csTeam: { type: Boolean, default: false },
    gtlHelp: { type: Boolean, default: false },
});

// the schema is useless so far
// we need to create a model using it
var TicketHelp = mongoose.model('TicketHelp', helpSchema);

// make this available to our users in our Node applications
module.exports = TicketHelp;