var mongoose = require('mongoose');
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp';

mongoose.Promise = global.Promise;
mongoose.connect(connectionString);

module.exports = {mongoose};
