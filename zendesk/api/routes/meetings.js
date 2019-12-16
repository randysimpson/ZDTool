'use strict';
module.exports = function(app) {
  var controller = require('../controllers/meeting');
  
  app.route('/api/v1/meeting')
    .get(controller.list)
    .post(controller.create);
    
  app.route('/api/v1/meeting/count')
    .get(controller.count);

  app.route('/api/v1/meeting/:id')
    .get(controller.select)
    .put(controller.update)
    .delete(controller.remove);
    
};