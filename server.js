//Dependencies//
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const http =require('http');
const path = require('path');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit  = require('express-rate-limit');

//PORTS//
var app = express();
const PORT = 3000;
//Create Server//
var server = http.createServer(app);

const limiter =rateLimit({
windowMs: 15 * 60 * 1000,
max: 100
});

// Sets up the Express app to handle data parsing
// app.use(bodyParser.urlencoded({extented: false}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './public')));
app.use(helmet());
app.use(limiter);

//Set up DB //
let db = new sqlite3.Database('alv');
db.run('CREATE TABLE IF NOT EXISTS emp(id TEXT, name TEXT)');

//ROUTES//
app.get('/', function(req,res){
    res.sendFile(path.join(__dirname, './public/form.html'));
});
//Set up a GET request to render our HTML PAGE


// Add//CREATE functionality
app.post("/add", function (req, res) {
    db.serialize(() => {
      db.run(
        "INSERT INTO emp(id,name) VALUES(?,?)",
        [req.body.id, req.body.name],
        function (err) {
          if (err) {
            return console.log(err.message);
          }
          console.log("New employee has been added");
          res.send(
            "New employee has been added into the database with ID = " +
              req.body.id +
              " and Name = " +
              req.body.name
          );
        }
      );
    });
  });
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

// View // READ
// View ADD
app.post("/view", function (req, res) {
    db.serialize(() => {
      db.each(
        "SELECT id ID, name NAME FROM emp WHERE id =?",
        [req.body.id],
        function (err, row) {
          //db.each() is only one which is funtioning while reading data from the DB
          if (err) {
            res.send("Error encountered while displaying");
            return console.error(err.message);
          }
          res.send(` ID: ${row.ID},    Name: ${row.NAME}`);
          console.log("Entry displayed successfully");
        }
      );
    });
  });
  

//Update
app.post("/update", function (req, res) {
    db.serialize(() => {
      db.run(
        "UPDATE emp SET name = ? WHERE id = ?",
        [req.body.name, req.body.id],
        function (err) {
          if (err) {
            res.send("Error encountered while updating");
            return console.error(err.message);
          }
          res.send("Entry updated successfully");
          console.log("Entry updated successfully");
        }
      );
    });
  });

// Delete
app.post("/delete", function (req, res) {
    db.serialize(() => {
      db.run(
        "DELETE FROM emp WHERE id = ?",  
        [req.body.id],
        function (err) {
          //db.each() is only one which is funtioning while reading data from the DB
          if (err) {
            res.send("Error encountered while deleting");
            return console.error(err.message);
          }
          res.send("You Deleted ID: ${row.ID}, Name: ${Name}");
          console.log("Entry deleted");
        });
    });
  });






// Closing the database connection.
app.get('/close', function(req,res){
    db.close((err) => {

        if (err) {
            res.send("There is some error in closing the database");
            return console.error(err.message);
        }
        console.log("Closing the database connection ");
        res.send("Database connection sucessfully closed");
    });
});


//Start your Server
app.listen(PORT, () => {
    console.log('App listening on port ${PORT}')

})
