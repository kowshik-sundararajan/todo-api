var mongoose = require('mongoose');

/*
	Creating a model
	- name of model
	- schema (properties of model)
*/
var Todo = mongoose.model('Todo', {
	text: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	completed: {
		type: Boolean,
		default: false
	},
	completedAt: {
		type: Number,
		default: null
	}
});

module.exports = {Todo};

// // creating an instance of Todo model
// var newTodo = new Todo({
// 	text: 'This is the first todo!'
// });

// // saving the instance to the DB
// newTodo.save().then((doc) => {
// 	console.log('* todo created', doc);
// }, (error) => {
// 	console.log('* unable to create todo', error);
// });
