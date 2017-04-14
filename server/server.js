require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

var {mongoose} = require('./config/mongoose');
var {User} = require('./models/User');
var {Todo} = require('./models/Todo');

var app = express();

var port = process.env.PORT || 3000;

app.use(bodyParser.json());
// app.use((err, req, res, next) => {
//   if (err instanceof SyntaxError) {
//     err = {error: 'Invalid json'}
//     res.send(err);
//   } else {
//     next();
//   }
// });

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

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectId.isValid(id)) {
    return req.status(404).end();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {
    $set: body
  }, {
    new: true
  }).then((todo) => {
    if (!todo) {
      res.stataus(404).end();
    }
    res.send({todo});
  }).catch((err) => {
    res.status(400).end();
  });
});

app.listen(port, () => {
    console.log('Server is running on port ' + port);
});

module.exports = {app};
