var http = require('http');
var ticketDB = require('../api/controllers/ticket');

var srStats = {
    
    //host: '10.127.129.37',
    host: 'srstatssvc',
    port: 3210,

    convert: function(id) {
        return new Promise(function(resolve, reject) {
            ticketDB.getByID([id]).then(function(tickets) {
                if(tickets.length == 1) {
                    var data = tickets[0];
                    var rtnData = {
                        id: data.id,
                        status: data.status,
                        type: data.type,
                        priority: data.priority,
                        url: data.url,
                        created: data.created,
                        updated: data.updated,
                        solved: data.solved
                    };
                    if(data.organization) {
                        rtnData.organization = {
                            id: data.organization.id,
                            name: data.organization.name
                        };
                    }
                    if(data.requestor) {
                        rtnData.requester = {
                            id: data.requestor.id,
                            name: data.requestor.name,
                            email: data.requestor.email,
                            role: data.requestor.role,
                        };
                    }
                    if(data.engineer) {
                        rtnData.assignee = {
                            id: data.engineer.id,
                            name: data.engineer.name,
                            team: data.engineer.team,
                            customName: data.engineer.customName,
                            role: data.engineer.role,
                            email: data.engineer.email,
                        };
                    }
                    if(data.jiria_links && data.jiria_links.length > 0) {
                        rtnData.jiria_links = true;
                    }
                    if(data.help.gtlHelp) {
                        rtnData.gtl_help = true;
                    }
                    if(data.help.csTeam) {
                        rtnData.cs_help = true;
                    }
                    rtnData.bounce_back = data.subject.toLowerCase().includes("bounced");
                    resolve(rtnData);
                } else
                    reject("no ticket found.");
            }).catch((err) => reject(err));
        });
    },
    post: function(id) {
        return new Promise(function(resolve, reject) {
            srStats.convert(id).then(function(ticket) {
                if(ticket) {
                    //console.log(srStats.convert(tickets[0]));
                    //console.log(tickets[0]);
                    var post_data = JSON.stringify(ticket);
            
                    var path = '/api/v1/tickets';
                    
                    // An object of options to indicate where to post to
                    var post_options = {
                        host: srStats.host,
                        port: srStats.port,
                        path: path,
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': Buffer.byteLength(post_data)
                        }
                    };

                    // Set up the request
                    var post_req = http.request(post_options, function(res) {
                        res.setEncoding('latin1');
                        res.on('data', function (chunk) {
                            //console.log('Response: ' + chunk);
                        });
                        res.on('end', function() {
                            resolve(ticket);
                        });
                    });
                    
                    post_req.on('error', function(e) {
                        reject(e);
                    });

                    // post the data
                    post_req.write(post_data);
                    post_req.end();
                }
            }).catch(function(err) {
                reject(err);
            });
        });
    },
    put: function(id) {
        return new Promise(function(resolve, reject) {
            srStats.convert(id).then(function(ticket) {
                if(ticket) {
                    //console.log(srStats.convert(tickets[0]));
                    //console.log(tickets[0]);
                    var post_data = JSON.stringify(ticket);
            
                    var path = '/api/v1/ticket/' + id;
                    
                    // An object of options to indicate where to post to
                    var post_options = {
                        host: srStats.host,
                        port: srStats.port,
                        path: path,
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Content-Length': Buffer.byteLength(post_data)
                        }
                    };

                    // Set up the request
                    var post_req = http.request(post_options, function(res) {
                        res.setEncoding('latin1');
                        res.on('data', function (chunk) {
                            //console.log('Response: ' + chunk);
                        });
                        res.on('end', function() {
                            resolve(ticket);
                        });
                    });
                    
                    post_req.on('error', function(e) {
                        reject(e);
                    });

                    // post the data
                    post_req.write(post_data);
                    post_req.end();
                }
            }).catch(function(err) {
                reject(err);
            });
        });
    }
};

module.exports = srStats;