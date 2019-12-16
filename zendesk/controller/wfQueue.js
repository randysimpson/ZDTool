var wfmetric = require('wfmetric'),
    Corespondence = require('../api/controllers/corespondence'),
    Ticket = require('../api/controllers/ticket');

wfmetric.host = 'wfproxysvc-try';
wfmetric.port = 3878;
wfmetric.source = 'zdtool';


function saveTicket(id) {
    return new Promise((resolve, reject) => {
        Ticket.getByID([id]).then(function(tickets) {
            if(tickets.length == 1) {
                var tags = {
                    priority: tickets[0].priority,
                    status: tickets[0].status,
                    type: tickets[0].type,
                    engineer: tickets[0].engineer.customName,
                    team: tickets[0].engineer.team,
                    id: "" + tickets[0].id
                };
                if(tickets[0].requestor && tickets[0].requestor.email) {
                    tags.requestor = tickets[0].requestor.email
                }
                wfmetric.post("Zendesk.Ticket", tickets[0].id, tags, tickets[0].updated)
                    .then(() => resolve())
                    .catch((err) => reject(err));
            }
        }).catch(function(err) {
            return res.send(err);
        });
    });
};

function saveCorespondence(id) {
    return new Promise((resolve, reject) => {
        Corespondence.selectOne(id).then((item) => {
            var tags = {
                type: item.type,
                author: item.author.email,
                ticket: "" + item.ticket_id
            };
            
            wfmetric.post("Zendesk.Correspondence", item.id, tags, item.created_at)
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    });
};

exports.queue = {
    corespondence: [],
    tickets: []
};

exports.addCorespondence = function(id) {
    //console.log("queued: " + id);
    //exports.queue.corespondence.push(id);
    setTimeout(function() {
        saveCorespondence(id);
    }, 1000 * 30); //wait 30 seconds
};

exports.addTicket = function(id) {
    //console.log("queued: " + id);
    //exports.queue.tickets.push(id);
    setTimeout(function() {
        saveTicket(id);
    }, 1000 * 30);  //wait 30 seconds
};

exports.run = function() {
    setInterval(function () {
        console.log("dequeueing....");
        while(exports.queue.tickets.length > 0) {
            var item = exports.queue.tickets.splice(1, 1);
            saveTicket(item);
        }
        while(exports.queue.corespondence.length > 0) {
            var item = exports.queue.corespondence.splice(1, 1);
            saveCorespondence(item);
        }
    }, 1000 * 60 * 10);  //every 10 min....
};