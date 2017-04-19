var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

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



app.listen(3000, () => {
	console.log('* starting app on port 3000');
})

module.exports = {app};
