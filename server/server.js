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
app.post('/todos', authenticate, (request, response) => {
	var todo = new Todo({
		text: request.body.text,
		_creator: request.user._id
	});

	todo.save().then((doc) => {
		response.send(doc);
	}, (error) => {
		response.status(400).send(error);
	});
});

app.get('/todos', authenticate, (request, response) => {
	Todo.find({_creator: request.user._id})
	.then((todos) => {
		response.send(todos);
	}, (error) => {
		response.status(400).send(error);
	});
});

app.get('/todos/:id', authenticate, (request, response) => {
	var id = request.params.id;

	if (!ObjectID.isValid(id)) {
		return response.status(404).send('ID is not valid');
	} else {
		Todo.findOne({
			_id: id,
			_creator: request.user._id
		}).then((todo) => {
			if (!todo) {
				return response.status(404).send('Todo does not exist');
			} else {
				return response.send({todo});
			}
		}, (error) => {
			return response.status(400).send(error);
		});
	}
});

app.delete('/todos/:id', authenticate, (request, response) => {
	var id = request.params.id;

	if(!ObjectID.isValid(id)) {
		return response.status(404).send('ID is not valid');
	} else {
		Todo.findOneAndRemove({
			_id: id,
			_creator: request.user._id
		}).then((todo) => {
			if (!todo) {
				return response.status(404).send('Todo does not exist');
			} else {
				return response.send({todo});
			}
		}, (error) => {
			return response.status(400).send(error);
		});
	}
});

app.patch('/todos/:id', authenticate, (request, response) => {
	var id = request.params.id;

	if (!ObjectID.isValid(id)) {
		return response.status(404).send('ID is not valid');
	} else {
		var body = _.pick(request.body, ['text', 'completed']);

		if (_.isBoolean(body.completed) && body.completed) {
			body.completedAt = new Date().getTime();
		} else {
			body.completed = false;
			body.completedAt = null;
		}

		Todo.findOneAndUpdate({
			_id: id,
			_creator: request.user._id
		}, {$set: body}, {new: true}).then((todo) => {
			if (!todo) {
				return response.status(404).send('Todo does not exist');
			} else {
				return response.send({todo});
			}
		}).catch((error) => {
			response.status(400).send(error);
		});
	}
});


app.post('/users', (request, response) => {
	var body = _.pick(request.body, ['name', 'email', 'password']);

	let user = new User({
		name: body.name,
		email: body.email,
		password: body.password,
	});

	user.save().then(() => {
		return user.generateAuthToken();
	})
	.then((token) => {
		response.header('x-auth', token).send({user});
	})
	.catch((error) => {
		response.status(400).send(error);
	});
});

app.get('/users/me', authenticate, (request, response) => {
	response.send(request.user);
});

app.post('/users/login', (request, response) => {
	var body = _.pick(request.body, ['email', 'password']);

	User.findByCredentials(body.email, body.password).then((user) => {
		return user.generateAuthToken().then((token) => {
			response.header('x-auth', token).send({user});
		});
	})
	.catch((error) => {
		response.status(400).send(error);
	});
});

app.delete('/users/me/token', authenticate, (request, response) => {
	request.user.removeToken(request.token).then(() => {
		response.status(200).send();
	}, () => {
		response.status(400).send();
	});
});

app.listen(port, () => {
	console.log(`* starting app on port ${port}`);
})

module.exports = {app};
