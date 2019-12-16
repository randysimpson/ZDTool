'use strict';
var mongoose = require('mongoose'),
  TicketHelp = mongoose.model('TicketHelp');


exports.getAll = function() {
    return new Promise(function(resolve, reject) {
        TicketHelp.find({}, function(err, result) {
            if(err)
                reject(err);
            else {
                resolve(result);
            }
        });
    });
}

exports.list = function(req, res) {
    exports.getAll().then(function(result) {
        res.json(result);
    }).catch(function(err) {
        return res.send(err);
    });
};

//need to handle base fields!
exports.create = function(req, res) {
  var newTicketHelp = new TicketHelp(req.body);
  newTicketHelp.save(function(err, ticketHelp) {
    if(err)
      return res.send(err);

    res.json(ticketHelp);
  });
};

exports.select = function(req, res) {
  TicketHelp.findById(req.params.id, function(err, ticketHelp) {
    if(err)
      return res.send(err);

    res.json(ticketHelp);
  });
};

exports.update = function(req, res) {
    var newItem = req.body;
    TicketHelp.findOneAndUpdate({ _id: req.params.id}, newItem, {new: true}, function(err, ticketHelp) {
        if(err)
            return res.send(err);

        else {
            res.json(ticketHelp);
        }
    });
};


exports.remove = function(req, res) {
  TicketHelp.remove({ _id: req.params.id}, function(err, ticketHelp) {
    if(err)
      return res.send(err);
  
    res.json({ message: 'ticketHelp deleted'});
  });
};