'use strict';
module.exports = function(app) {
  var controller = require('../controllers/ticketTable');
  
  app.route('/api/v1/ticket-table')
    .get(controller.list)
    .post(controller.create);
    
  app.route('/api/v1/ticket-table/:id')
    .get(controller.select)
    .put(controller.update)
    .delete(controller.remove);
};