'use strict';
module.exports = function(app) {
  var controller = require('../controllers/ticket');
  
  app.route('/api/v1/tickets/id')
    .get(controller.listIDs);
    
  app.route('/api/v1/tickets/count')
    .get(controller.count);

  app.route('/api/v1/tickets')
    .get(controller.list)
    .post(controller.create);
    
  app.route('/api/v1/tickets/:ids')
    .get(controller.list);
    
  app.route('/api/v1/ticket/:id')
    .get(controller.select)
    .put(controller.update)
    .delete(controller.remove);
    
};