'use strict';
module.exports = function(app) {
  var controller = require('../controllers/corespondence');
  
  app.route('/api/v1/corespondence/ticketids/:ids')
    .get(controller.idList);
  app.route('/api/v1/ticket/:id/corespondence')
    .get(controller.list);
    
    app.route('/api/v1/corespondence/count')
        .get(controller.count);
  
  app.route('/api/v1/corespondence')
    .post(controller.create)
    .get(controller.list);
  //app.route('/api/v1/fixcor')
  //  .get(controller.fix);
    
  app.route('/api/v1/corespondence/:id')
    .get(controller.select)
    .put(controller.update)
    .delete(controller.remove);
};