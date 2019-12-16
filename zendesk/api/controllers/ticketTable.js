'use strict';
var mongoose = require('mongoose'),
    Ticket = require('./ticket'),
    TicketTable = mongoose.model('TicketTable');

function loadDetails(tickettables) {
    var ticketTables = [];
    for(var k = 0; k < tickettables.length; k++) {
        ticketTables.push(tickettables[k].toObject());
    }
    return new Promise(function(resolve, reject) {
        //get the list of tickets.
        var ticketList = [];
        for(var i = 0; i < ticketTables.length; i++) {
            for(var j = 0; j < ticketTables[i].ticketTrouble.length; j++) {
                ticketList.push(ticketTables[i].ticketTrouble[j].ticket.id);
            }
        }
        //console.log(ticketList);
        Ticket.getByID(ticketList).then(function(tickets) {
            for(var i = 0; i < ticketTables.length; i++) {
                for(var j = 0; j < ticketTables[i].ticketTrouble.length; j++) {
                    var ticket = tickets.filter(t => (t.id == ticketTables[i].ticketTrouble[j].ticket.id));
                    ticketTables[i].ticketTrouble[j].ticket = ticket[0];
                }
            }
            resolve(ticketTables);
        }).catch(function(err) {
            reject(err);
        });
        
        /*loadDependencies().then(function(result) {
            var rtnTickets = [];
            for(var i = 0; i < ticketTables.length; i++) {
                var ticket = ticketTables[i].toObject();
                var currentID = result.organizations.filter(organization => (organization.id == ticket.organization_id));
                if(currentID.length == 1) {
                    ticket.organization = currentID[0];
                }
                currentID = result.requestors.filter(requestor => (requestor.id == ticket.requester_id));
                if(currentID.length == 1) {
                    ticket.requestor = currentID[0];
                }
                currentID = result.engineers.filter(engineer => (engineer.id == ticket.assignee_id));
                if(currentID.length == 1) {
                    ticket.engineer = currentID[0];
                }
                rtnTickets.push(ticket);
            }
            resolve(rtnTickets);
        }).catch(function(err) {
            reject(err);
        });*/
    });
}

function formatSave(details) {
    //console.log(details);
    return new Promise(function(resolve, reject) {
        if(!details)
            reject("No data");
        else {
            //only save ticket id's
            for(var i = 0; i < details.ticketTrouble.length; i++) {
                var ticketID = details.ticketTrouble[i].ticket.id;
                delete details.ticketTrouble[i].ticket;
                details.ticketTrouble[i].ticket = {
                    id: ticketID
                };
            }
            if(!details.created)
                details.created = new Date();
            details.updated = new Date();
            resolve(details);
        }
    });
}

exports.list = function(req, res) {
  TicketTable.find({}).limit(100).sort('_id').exec(function(err, result) {
    if(err)
      return res.send(err);

    loadDetails(result).then(function(ticketTable) {
        res.json(ticketTable);
    }).catch(function(err) {
        return res.send(err);
    });
  });
};

exports.create = function(req, res) {
    formatSave(req.body).then(function(result) {
        var newTicket = new TicketTable(result);
        newTicket.save(function(err, ticketTable) {
            if(err)
              return res.send(err);

            loadDetails([ticketTable]).then(function(rtnResult) {
                res.json(rtnResult[0]);
            }).catch(function(err) {
                console.log(err);
                res.status(500).send({ message: "TicketTable saved but issue may have caused inconsistancies." });
            });
        });
    }).catch(function(err) {
        console.log(err);
        res.status(404).send({ message: "TicketTable not in correct format." });
    });
};

exports.select = function(req, res) {
    TicketTable.find({ _id: req.params.id }, function(err, result) {
        if(err)
            return res.send(err);

        loadDetails(result).then(function(ticketTable) {
            if(ticketTable.length == 0)
                res.status(404).send({ message: "TicketTable not found." });
            else if(ticketTable.length == 1)
                res.json(ticketTable[0]);
            else
                res.json(ticketTable);
        }).catch(function(err) {
            return res.send(err);
        });
    });
};

exports.update = function(req, res) {
    formatSave(req.body).then(function(result) {
        TicketTable.findOneAndUpdate({ _id: req.params.id}, result, {new: true}, function(err, ticketTable) {
            if(err)
                return res.send(err);

            res.json(ticketTable);
        });
    }).catch(function(err) {
        res.status(404).send({ message: "TicketTable not in correct format." });
    });
};

exports.remove = function(req, res) {
  TicketTable.remove({ id: req.params.id}, function(err, ticketTable) {
    if(err)
      return res.send(err);
  
    res.json({ message: 'TicketTable deleted'});
  });
};