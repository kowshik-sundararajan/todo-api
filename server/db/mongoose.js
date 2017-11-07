var mongoose = require('mongoose');

// Making mongoose use the default promise and not a third-party promise
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp')

module.exports = {mongoose};
