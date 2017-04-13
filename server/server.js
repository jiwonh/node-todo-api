var {mongoose} = require('./config/mongoose');
var {User} = require('./models/User');
var {Todo} = require('./models/Todo');

var express = require('express');
var bodyParser = require('body-parser');
var {ObjectId} = require('mongodb');

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

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).send({error: 'Invalid Id'});
  }

  Todo.findById(id).then((todo) => {
    if (!todo) {
      return res.status(404).send({error: 'Id not found'});
    }
    res.send({todo});
  }).catch((err) => {
    res.status(400).send({error: 'Bad request'});
  });
});

app.delete('/todos/:id', (req, res) => {
  var id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (!todo) {
      res.status(404).end();
    }
    res.send({todo});
  }).catch((err) => {
    res.status(400).send();
  });
});

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});

module.exports = {app};
