'use strict';
var mongoose = require('mongoose'),
  User = mongoose.model('User');

exports.list = function(req, res) {
  User.find({}, function(err, result) {
    if(err)
      return res.send(err);

    if(result.length > 0) {
      for(var i = 0; i < result.length; i++) {
        result[i] = result[i].toObject();
        delete result[i].password;
        delete result[i].salt;
      }
    }
    res.json(result);
  });
};

exports.create = function(req, res) {
  var newUser = new User(req.body);
  newUser.save(function(err, user) {
    if(err)
      return res.send(err);

    res.json(user);
  });
};

exports.select = function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if(err)
      return res.send(err);

    if(user) {
        user = user.toObject();
        delete user.password;
        delete user.salt;
    }
    res.json(user);
  });
};

exports.update = function(req, res) {
  User.findOneAndUpdate({_id: req.params.id}, req.body, {new: true}, function(err, user) {
    if(err)
      return res.send(err);

    res.json(user);
  });
};

exports.remove = function(req, res) {
  User.remove({_id: req.params.id}, function(err, user) {
    if(err)
      return res.send(err);
  
    res.json({ message: 'User deleted'});
  });
};

exports.auth = function(req, res) {
  if(req.query.username && req.query.password) {
    User.find({username: req.query.username}, function(err, result) {
      if(err)
        return res.send(err);

      if(result.length > 0) {
        var foundUser = new User(result[0]);
        foundUser.checkPassword(req.query.password, function(err, result) {
          if(err)
            return res.send(err);
          if(result) {
            foundUser = foundUser.toObject();
            delete foundUser.password;
            delete foundUser.salt;

            return res.json({
              success: true,
              message: 'Success.',
              user: foundUser
            });
          } else
            return res.status(401).send({ success: false, message: 'Invalid password.'});
        });
      } else {
        return res.status(401).send({ success: false, message: 'Invalid username.'});
      }
    });
  } else {
    return res.status(401).send({ success: false, message: 'Incorrect query parameters.'});
  }
};