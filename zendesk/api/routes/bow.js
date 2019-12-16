'use strict';
module.exports = function(app) {
  var controller = require('../controllers/bow');
  
    app.route('/api/v1/bow/count')
        .get(controller.count);
  
  app.route('/api/v1/bow')
    .post(controller.create)
    .get(controller.list);
    
  app.route('/api/v1/corespondence/:id/bow')
    .get(controller.select)
    .put(controller.update)
    .delete(controller.remove);
};