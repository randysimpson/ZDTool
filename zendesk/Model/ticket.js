// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var ticketSchema = new Schema({
    id: { type: Number, required: true, unique: true },
    subject: String,
    description: String,
    status: String,
    type: String,
    priority: String,
    url: String,
    last_comment: Schema.Types.Mixed,
    via_id: Number,
    organization_id: Number,
    requester_id: Number,
    created: { type: Date},
    updated: { type: Date},
    assignee_id: Number,
    solved: { type: Date},
    jiria_links: Schema.Types.Mixed,
    raw_subject: String,
    tags: Schema.Types.Mixed
});

// the schema is useless so far
// we need to create a model using it
var Ticket = mongoose.model('Ticket', ticketSchema);

// make this available to our users in our Node applications
module.exports = Ticket;