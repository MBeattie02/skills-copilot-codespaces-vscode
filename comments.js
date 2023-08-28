// Create web server
// Start server with
// $ node comments.js
var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
var path = require('path');

// Set view engine to ejs
app.set('view engine', 'ejs');

// Set static file directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// GET /
app.get('/', function(req, res){
  res.render('form');
});

// POST /
app.post('/', function(req, res){
  console.log(req.body);
  res.render('form');
});

// GET /comments
app.get('/comments', function(req, res){
  fs.readFile('comments.json', function(err, data){
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
});

// POST /comments
app.post('/comments', function(req, res){
  fs.readFile('comments.json', function(err, data){
    var comments = JSON.parse(data);
    comments.push(req.body);
    fs.writeFile('comments.json', JSON.stringify(comments, null, 4), function(err){
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-cache');
      res.send(JSON.stringify(comments));
    });
  });
});

// GET /comments/:id
app.get('/comments/:id', function(req, res){
  fs.readFile('comments.json', function(err, data){
    var comments = JSON.parse(data);
    var comment = comments[req.params.id];
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(comment));
  });
});

// DELETE /comments/:id
app.delete('/comments/:id', function(req, res){
  fs.readFile('comments.json', function(err, data){
    var comments = JSON.parse(data);
    comments.splice(req.params.id, 1);
    fs.writeFile('comments.json', JSON.stringify(comments, null, 4), function(err){
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-cache');
      res.send(JSON.stringify(comments));
    });
  });
});

// PUT /comments/:id