var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


var app = express();
const port = process.env.PORT || 3000;

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



app.listen(port, () => {
	console.log(`* starting app on port ${port}`);
})

module.exports = {app};
