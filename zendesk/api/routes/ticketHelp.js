'use strict';
module.exports = function(app) {
  var controller = require('../controllers/ticketHelp');
  
  app.route('/api/v1/tickethelp')
    .get(controller.list)
    .post(controller.create);
    
  app.route('/api/v1/tickethelp/:id')
    .get(controller.select)
    .put(controller.update)
    .delete(controller.remove);
};