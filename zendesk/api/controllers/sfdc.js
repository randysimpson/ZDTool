'use strict';
var mongoose = require('mongoose'),
  Ticket = require('./ticket'),
  Sfdc = mongoose.model('Sfdc'),
  ObjectID = require("mongodb").ObjectID;

exports.getByID = function(ids) {
  return new Promise(function(resolve, reject) {
    if (!ids)
      reject("Not correct parameter");
    else {
      Sfdc.find({
        caseNumber: {
          "$in": ids
        }
      }).exec(function(err, result) {
        if (err)
          reject(err);

        resolve(result);
      });
    }
  });
}

exports.getByTicketIDList = function(ids) {
  return new Promise((resolve, reject) => {
    Sfdc.find({
      ticketID: {
        "$in" : ids
      }
    }).exec((err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    })
  });
};

exports.count = function(req, res) {
  var searchBegin = req.query.begin;
  var searchEnd = req.query.end;
  var criteria = {};

  if (searchBegin) {
    if (searchEnd) {
      criteria = {
        '$or': [{
          'created': {
            $gte: new Date(searchBegin),
            $lt: new Date(searchEnd)
          }
        }, {
          'solved': {
            $gte: new Date(searchBegin),
            $lt: new Date(searchEnd)
          }
        }]
      };
    } else {
      criteria.created = {
        $gte: new Date(searchBegin)
      }
    }
  }
  console.log(criteria);
  Sfdc.find(criteria).count().exec(function(err, result) {
    console.log(result);
    if (err)
      return res.send(err);

    res.json(result);
  });
}

exports.list = function(req, res) {
  var ids = req.params.ids;
  if (ids) {
    var idList = ids.split(",");
    exports.getByID(idList).then(function(results) {
      if (results.length == 0)
        res.status(404).send({
          message: "Sfdc's not found."
        });
      else if (results.length == 1)
        res.json(results[0]);
      else
        res.json(results);
    }).catch(function(err) {
      return res.send(err);
    });
  } else {
    var searchBegin = req.query.begin;
    var searchEnd = req.query.end;
    var limit = req.query.limit;
    var sort = req.query.sort;
    var startIndex = req.query.startIndex;
    var criteria = req.query.criteria;
    //console.log(criteria);
    if (!criteria)
      criteria = {};
    else
      criteria = Function('"use strict";return (' + criteria + ')')();
    if (searchBegin) {
      if (searchEnd) {
        criteria = {
          '$or': [{
            'created': {
              $gte: new Date(searchBegin),
              $lt: new Date(searchEnd)
            }
          }, {
            'solved': {
              $gte: new Date(searchBegin),
              $lt: new Date(searchEnd)
            }
          }]
        };
      } else {
        criteria.created = {
          $gte: new Date(searchBegin)
        }
      }
    }
    if (!limit)
      limit = 150;
    else
      limit = parseInt(limit);
    if (!sort)
      sort = {
        id: 1
      };
    else {
      console.log(sort);
      sort = Function('"use strict";return (' + sort + ')')();
    }
    if (!startIndex)
      startIndex = 0;
    else
      startIndex = parseInt(startIndex);
    console.log({
      criteria: criteria,
      sort: sort
    });
    Sfdc.find(criteria).limit(limit).skip(startIndex).sort(sort).exec(function(err, result) {
      if (err)
        return res.status(500).send(err);

      res.json(result);
      /*loadDetails(result).then(function(tickets) {
          res.json(tickets);
      }).catch(function(err) {
          return res.send(err);
      });*/
    });
  }
};

exports.listIDs = function(req, res) {
  Sfdc.find({}, function(err, result) {
    if (err)
      return res.send(err);

    var rtnList = [];
    for (var i = 0; i < result.length; i++) {
      rtnList.push({
        caseNumber: result[i].caseNumber
      });
    }
    res.json(rtnList);
  });
};

const modifyText = (description) => {
  let modDescription = description.replace(/<br>/g, '\n');
  modDescription = modDescription.replace(/<\/A>/g, '');
  modDescription = modDescription.replace(/&quot;/g, '"');
  modDescription = modDescription.replace(/&amp;/g, '&');
  modDescription = modDescription.replace(/&gt;/g, '>');
  modDescription = modDescription.replace(/&lt;/g, '<');
  modDescription = modDescription.replace(/&#39;/g, '\'');

  let index = modDescription.indexOf('<A HREF');
  while (index > 0) {
    modDescription = modDescription.substring(0, index) + modDescription.substring(modDescription.indexOf('>', index + 1) + 1);
    index = modDescription.indexOf('<A HREF');
  }

  if (modDescription.endsWith('...'))
    modDescription = modDescription.substring(0, modDescription.length - 3);

  return modDescription;
}

exports.create = function(req, res) {
  //console.log(req.body);
  var newItem = new Sfdc(req.body);
  //check if we need to add the ticketID
  /*if (newItem.resolution.startsWith('Case Migration from Wavefront legacy system')) {
    Ticket.selectID(new Date(newItem.created), newItem.subject, newItem.description)
  }*/
  //create raw_subject and raw_description.
  newItem.raw_subject = modifyText(newItem.subject);
  newItem.raw_description = modifyText(newItem.description);

  newItem.save(function(err, item) {
    if (err)
      return res.send(err);

    res.json(item);
    //save metric to cs.
    //wfQueue.addTicket(ticket.id);

    /*setTimeout(function() {
        srStats.post(ticket.id).then().catch((err) => console.log(err));
    }, 2000);*/
  });
};

exports.select = function(req, res) {
  exports.getByID([req.params.id]).then(function(results) {
    if (results.length == 0)
      res.status(404).send({
        message: "Sfdc not found."
      });
    else if (results.length == 1)
      res.json(results[0]);
    else
      res.json(results);
  }).catch(function(err) {
    return res.send(err);
  });
};

exports.update = function(req, res) {
  //console.log(req.body);
  /*console.log({
      id: req.params.id,
      body: req.body
  });*/
  let updateItem = req.body;
  updateItem.raw_subject = modifyText(updateItem.subject);
  updateItem.raw_description = modifyText(updateItem.description);

  if(updateItem.ticketID)
    updateItem.ticketID = ObjectID(updateItem.ticketID);

  Sfdc.findOneAndUpdate({
    caseNumber: req.params.id
  }, updateItem, {
    new: true
  }, function(err, item) {
    if (err)
      return res.send(err);

    res.json(item);
    //save metric to cs.
    /*wfQueue.addTicket(ticket.id);

    setTimeout(function() {
        srStats.put(ticket.id).then().catch((err) => console.log(err));
    }, 2000);*/
  });
};

exports.remove = function(req, res) {
  Sfdc.remove({
    caseNumber: req.params.id
  }, function(err, item) {
    if (err)
      return res.send(err);

    res.json({
      message: 'Sfdc deleted'
    });
  });
};
