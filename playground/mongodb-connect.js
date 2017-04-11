//const MongoClient = require('mongodb').MongoClient;
// Object deconstruction
const {MongoClient, ObjectId} = require('mongodb');

var objId = new ObjectId();
console.log(objId);

MongoClient.connect('mongodb://localhost/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect MongoDB Server');
  }

  console.log('Conntected tp MongoDB Server');

  // db.collection('Todos').insertOne({
  //   text: 'Something to do 2',
  //   complated: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert', err);
  //   }
  //
  //   console.log(JSON.stringify(result.ops, undefined, 2))
  // });

  // db.collection('Users').insertOne({
  //   name: 'Jiwon',
  //   age: 40,
  //   location: '819 115th St SW'
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Unable to insert user', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  db.close();
});
