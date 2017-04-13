const {mongoose} = require('./../server/config/mongoose');
const {Todo} = require('./../server/models/Todo');
const {User} = require('./../server/models/User');
const {ObjectId} = require('mongodb');

// var id = '58eed0fbc684a50d3c885553';
//
// if (!ObjectId.isValid(id)) {
//   console.log('Id not valid');
// }

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todo', todo);
// });

// Todo.findById(id).then((todo) => {
//   console.log('Todo By Id', todo);
// }, (err) => console.log(err));

User.findById('58ed6e40e9688f79585e1af3').then((user) => {
  if (!user) {
    return console.log('User not found');
  }
  console.log('User', user);
}).catch((err) => console.log(err));
