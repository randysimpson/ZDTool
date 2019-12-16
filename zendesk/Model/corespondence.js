// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var corespondenceSchema = new Schema({
  id: { type: Number, required: true, unique: true },
  attachments: Schema.Types.Mixed,
  audit_id: Number,
  author_id: Number,
  body: String,
  created_at: { type: Date},
  html_body: String,
  plain_body: String,
  isPublic: Boolean,
  type: String,
  ticket_id: Number
});

// the schema is useless so far
// we need to create a model using it
var Corespondence = mongoose.model('Corespondence', corespondenceSchema);

// make this available to our users in our Node applications
module.exports = Corespondence;