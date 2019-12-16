'use strict';
module.exports = function(app) {
  var controller = require('../controllers/sfdc');

  app.route('/api/v1/sfdc/id')
    .get(controller.listIDs);

  app.route('/api/v1/sfdc/count')
    .get(controller.count);

  app.route('/api/v1/sfdc')
    .get(controller.list)
    .post(controller.create);

  app.route('/api/v1/sfdc/search/:ids')
    .get(controller.list);

  app.route('/api/v1/sfdc/:id')
    .get(controller.select)
    .put(controller.update)
    .delete(controller.remove);

};
