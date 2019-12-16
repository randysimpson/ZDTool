'use strict';
module.exports = function(app) {
  var controller = require('../controllers/user');
  
  app.route('/api/v1/users')
    .get(controller.list)
    .post(controller.create);
    
  app.route('/api/v1/users/:id')
    .get(controller.select)
    .put(controller.update)
    .delete(controller.remove);
};