'use strict';
module.exports = function(app) {
  var controller = require('../controllers/user');
  
  app.route('/auth')
    .get(controller.auth)
    .post(controller.auth);
};