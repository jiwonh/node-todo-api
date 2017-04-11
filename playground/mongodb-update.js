const {MongoClient, ObjectId} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect Mongo DB server');
  }
  console.log('MongoDB connected');

  // findOneAndUpdate
  // db.collection('Todos').findOneAndUpdate({
  //   _id: new ObjectId("58ec7364b54a6510db1e165f")
  // }, {
  //   $set: {completed: false}
  // }, {
  //   returnOriginal: false
  // }, (err, doc) => {
  //   if (err) {
  //     return console.log(err);
  //   }
  //   console.log(doc);
  // });

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectId("58ec16fb7f80c053f83cf2fc")
  }, {
    $set: {name: 'Juyoung'},
    $inc: {age: 1},
  }, {
    returnOriginal: false
  }).then((result) => {
    console.log(result);
  });

  //db.close();
});
