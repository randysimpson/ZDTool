// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var meetingSchema = new Schema({
    title: String,
    meetingDate: Date,
    recordingUrl: String,
    meetingNotes: [String],
    attendance: Schema.Types.Mixed,
    ticketDiscussion: Schema.Types.Mixed,
    categoryID: Number,
    created: { type: Date},
    updated: { type: Date},
    addedConfluence: { type: Date }
});

// the schema is useless so far
// we need to create a model using it
var Meeting = mongoose.model('Meeting', meetingSchema);

// make this available to our users in our Node applications
module.exports = Meeting;