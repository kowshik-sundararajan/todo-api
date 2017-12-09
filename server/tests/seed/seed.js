const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');


const secret = 'abc123';
const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    name: 'Kowshik',
    email: 'kow@gmail.com',
    password: 'Password123',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId}, secret).toString()
    }]
}, {
    _id: userTwoId,
    name: 'Antara',
    email: 'anta@face.com',
    password: '123Password',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userTwoId}, secret).toString()
    }]
}];

const todos = [{
    _id: new ObjectID(),
    text: "First test todo",
    _creator: userOneId
}, {
    _id: new ObjectID(),
    text: "Second test todo",
    completed: true,
    completedAt: 333,
    _creator: userTwoId
}];

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo])
    }).then(() => done());
};

// sets up something before the tests are run - in this case we want to empty the database
const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

module.exports = {todos, users, populateTodos, populateUsers};
