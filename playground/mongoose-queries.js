const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
const {ObjectID} = require('mongodb');

// var id = '5a0142f14cec45c83648293611';

// if (!ObjectID.isValid(id)) {
//     console.log('ID is not valid');
// } else {
//     Todo.findById(id).then((todo) => {
//         if (!todo) {
//             return console.log('ID not found');
//         }
//         console.log('Todo By ID', todo);
//     }).catch((e) => console.log(e));
// }
// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo', todo);
// });


var id = '5a01461a348958c918a35c1b';

if (!ObjectID.isValid(id)) {
    console.log('ID is not valid');
} else {
    User.findById(id).then((user) => {
        console.log(user);
    }).catch((e) => console.log(e));
}



