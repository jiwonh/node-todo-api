const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect Mongo DB server');
  }
  console.log('MongoDB connected');

  db.collection('Todos').find().toArray().then((docs) => {
    console.log("find() Example");
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Unable to fetch users', err);
  });

  db.collection('Todos', (err, collection) => {
    collection.findOne({completed: true}, (err, doc) => {
      console.log('findOne() example 1');
      console.log(JSON.stringify(doc, undefined, 2));
    });
  });

  db.collection('Todos').findOne({completed: true}, (err, doc) => {
    if (err) {
      return console.log(err);
    }
    console.log('findOne() example 2');
    console.log(JSON.stringify(doc, undefined, 2));
  });

  db.close();
});
