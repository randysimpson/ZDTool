'use strict';
module.exports = function(app) {
  var controller = require('../controllers/engineer');
  
  app.route('/api/v1/engineers')
    .get(controller.list)
    .post(controller.create);
    
  app.route('/api/v1/engineer/:id')
    .get(controller.select)
    .put(controller.update)
    .delete(controller.remove);
};