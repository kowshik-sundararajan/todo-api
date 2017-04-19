var mongoose = require('mongoose');

var User = mongoose.model('User', {
	name: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	email: {
		type: String,
		required: true,
		minlength: 1,
		trim: 1
	}
});

module.exports = {User};

// var newUser = new User({
// 	name: 'Kowshik',
// 	email: 'kow@gmail.com'
// });

// newUser.save().then((doc) => {
// 	console.log('* user created', doc);
// }, (error) => {
// 	console.log('* unable to create user', error);
// });
