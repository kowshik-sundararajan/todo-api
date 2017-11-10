const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

require('./config/config');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

// creating a todo
app.post('/todos', (request, response) => {
	var todo = new Todo({
		text: request.body.text,
		completed: request.body.completed
	});

	todo.save().then((doc) => {
		response.send(doc);
	}, (error) => {
		response.status(400).send(error);
	});
});

app.get('/todos', (request, response) => {
	Todo.find().then((todos) => {
		console.log(JSON.stringify(todos, undefined, 2));
		response.send(todos);
	}, (error) => {
		response.status(400).send(error);
	});
});

app.get('/todos/:id', (request, response) => {
	var id = request.params.id;

	if (!ObjectID.isValid(id)) {
		return response.status(404).send('ID is not valid');
	} else {
		Todo.findById(id).then((todo) => {
			if (!todo) {
				return response.status(404).send('Todo does not exist');
			} else {
				return response.send({todo});
			}
		}, (error) => {
			return response.status(400).send('');
		});
	}
});

app.delete('/todos/:id', (request, response) => {
	var id = request.params.id;

	if(!ObjectID.isValid(id)) {
		return response.status(404).send('ID is not valid');
	} else {
		Todo.findByIdAndRemove(id).then((todo) => {
			if (!todo) {
				return response.status(404).send('Todo does not exist');
			} else {
				return response.send({todo});
			}
		}, (error) => {
			return response.status(400).send('');
		});
	}
});

app.patch('/todos/:id', (request, response) => {
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

		Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
			if (!todo) {
				return response.status(404).send('Todo does not exist');
			} else {
				return response.send({todo});
			}
		}).catch((error) => {
			response.status(400).send('');
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



app.listen(port, () => {
	console.log(`* starting app on port ${port}`);
})

module.exports = {app};
