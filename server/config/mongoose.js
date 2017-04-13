var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp').then(() => {
  //console.log('Connected to MongoDB Server.');
},
err => {
  //console.log('Mongodb connection error: ', err);
});

module.exports = {mongoose};
