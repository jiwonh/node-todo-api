var mongoose = require('mongoose');
const connectionString = process.env.MONGODB_URI;

mongoose.Promise = global.Promise;
mongoose.connect(connectionString);

module.exports = {mongoose};
