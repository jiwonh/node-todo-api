var {mongoose} = require('./config/mongoose');
var {User} = require('./models/User');
var {Todo} = require('./models/Todo');

var express = require('express');
var bodyParser = require('body-parser');

var port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });
});

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});

module.exports = {app};
