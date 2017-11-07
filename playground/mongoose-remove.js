const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
const {ObjectID} = require('mongodb');

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// Todo.findOneAndRemove({}).then((result) => {
//     console.log(result);
// });

var id = '5a01533bc23c1a7f18b665ed';

Todo.findByIdAndRemove({id}).then((todo) => {
    console.log(todo);
})
