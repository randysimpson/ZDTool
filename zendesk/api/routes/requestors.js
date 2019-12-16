'use strict';
module.exports = function(app) {
  var controller = require('../controllers/requestor');
  
  app.route('/api/v1/requestors')
    .get(controller.list)
    .post(controller.create);
    
  app.route('/api/v1/requestor/:id')
    .get(controller.select)
    .put(controller.update)
    .delete(controller.remove);
};