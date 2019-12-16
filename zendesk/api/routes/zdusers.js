'use strict';
module.exports = function(app) {
  var controller = require('../controllers/zduser');
  
  app.route('/api/v1/zduser')
    .get(controller.list)
    .post(controller.create);
    
  app.route('/api/v1/zduser/:id')
    .get(controller.select)
    .put(controller.update)
    .delete(controller.remove);
};