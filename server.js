const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use('/', router);

app.listen(3000);
console.log("Server started");

//Find and display all tickets
router.get('/rest/list', function(req, res) {
    fs.readdir("./tickets", (err, ticketIDs) => {
        const tickets = new Array();
        ticketIDs.forEach(fileID => {
            fs.readFile("./tickets/" + fileID, "utf8", (err, jsonString) => {
                tickets.push(jsonString);
                if(tickets.length == ticketIDs.length){
                    res.send(tickets);
                }
            });
        })
    });
});


//Find and display a ticket with given id
router.get('/rest/ticket/id', function(req, res) {
    console.log(req.body);
    fs.readFile("./tickets/" + req.body.id + ".json", "utf8", (err, jsonString) => {
        if (err){
            res.status(200).send("ID not found");
            return;
        }
        res.status(200).send(jsonString);
    });
});

//Create a new ticket
router.post('/rest/ticket', function(req, res) {
    const newTicket = {
        id: req.body.id,
        type: req.body.type,
        subject: req.body.subject,
        description: req.body.description,
        status: req.body.status
    };
    const newTicketString = JSON.stringify(newTicket);
    fs.writeFile("./tickets/" + req.body.id + ".json", newTicketString, err => {
        if (err) {
            res.status(200).send("Error writing ticket, ticket not recorded.")
        } else {
            res.status(200).send("Ticket successfully recorded")
        }
    });
});

