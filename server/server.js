const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

require('./config/config');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

// creating a todo
app.post('/todos', authenticate, async (request, response) => {
	try {
		const todo = new Todo({
			text: request.body.text,
			_creator: request.user._id
		});
		const doc = await todo.save();
		response.send(doc);
	} catch(error) {
		response.status(400).send(error);
	}
});

app.get('/todos', authenticate, async (request, response) => {
	try {
		const todos = await Todo.find({_creator: request.user._id});
		response.send(todos);
	} catch(error) {
		response.status(400).send(error);
	}
});

app.get('/todos/:id', authenticate, async (request, response) => {
	const id = request.params.id;

	if (!ObjectID.isValid(id)) {
		return response.status(404).send('ID is not valid');
	}

	try {
		const todo = await Todo.findOne({
			_id: id,
			_creator: request.user._id
		});

		if (!todo) {
			return response.status(404).send('Todo does not exist');
		} else {
			return response.send({todo});
		}

	} catch (error) {
		return response.status(400).send(error);
	}
});

app.delete('/todos/:id', authenticate, async (request, response) => {
	const id = request.params.id;

	if(!ObjectID.isValid(id)) {
		return response.status(404).send('ID is not valid');
	}

	try {
		const todo = await Todo.findOneAndRemove({
			_id: id,
			_creator: request.user._id
		});

		if (!todo) {
			return response.status(404).send('Todo does not exist');
		} else {
			return response.send({todo});
		}
	} catch(error) {
		return response.status(400).send(error);
	}
});

app.patch('/todos/:id', authenticate, async (request, response) => {
	const id = request.params.id;

	if (!ObjectID.isValid(id)) {
		return response.status(404).send('ID is not valid');
	}

	var body = _.pick(request.body, ['text', 'completed']);

	if (_.isBoolean(body.completed) && body.completed) {
		body.completedAt = new Date().getTime();
	} else {
		body.completed = false;
		body.completedAt = null;
	}

	try {
		const todo = await Todo.findOneAndUpdate({
			_id: id,
			_creator: request.user._id
		}, {$set: body}, {new: true});

		if (!todo) {
			return response.status(404).send('Todo does not exist');
		} else {
			return response.send({todo});
		}
	} catch(error) {
		response.status(400).send(error);
	}
});


app.post('/users', async (request, response) => {
	try {
		const body = _.pick(request.body, ['name', 'email', 'password']);
		const user = new User(body);
		await user.save();
		const token = await user.generateAuthToken();
		response.header('x-auth', token).send({user});
	} catch(error) {
		response.status(400).send(error);
	}
});

app.get('/users/me', authenticate, (request, response) => {
	response.send(request.user);
});

app.post('/users/login', async (request, response) => {
	try {
		const body = _.pick(request.body, ['email', 'password']);
		const user = await User.findByCredentials(body.email, body.password);
		const token = await user.generateAuthToken();
		response.header('x-auth', token).send({user});
	} catch(error) {
		response.status(400).send(error);
	}
});

app.delete('/users/me/token', authenticate, async (request, response) => {
	try {
		await request.user.removeToken(request.token);
		response.status(200).send();
	} catch(error) {
		response.status(400).send();
	}
});

app.listen(port, () => {
	console.log(`* starting app on port ${port}`);
})

module.exports = {app};
