// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var ticketTableSchema = new Schema({
  ticketTrouble: Schema.Types.Mixed,
  created: { type: Date},
  updated: { type: Date}
});

// the schema is useless so far
// we need to create a model using it
var TicketTable = mongoose.model('TicketTable', ticketTableSchema);

// make this available to our users in our Node applications
module.exports = TicketTable;