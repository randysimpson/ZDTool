'use strict';
module.exports = function(app) {
  var controller = require('../controllers/organization');
  
  app.route('/api/v1/organizations')
    .get(controller.list)
    .post(controller.create);
    
  app.route('/api/v1/organization/:id')
    .get(controller.select)
    .put(controller.update)
    .delete(controller.remove);
};