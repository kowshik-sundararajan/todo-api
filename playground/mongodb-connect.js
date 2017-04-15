//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('* unable to connect to the database server');
	}

	console.log('* connected to database server');

	// db.collection('Todos').insertOne({
	// 	text: 'First todo',
	// 	completed: false
	// }, (err, result) => {
	// 	if (err) {
	// 		return console.log('unable to insert todo', err);
	// 	}

	// 	console.log(JSON.stringify(result.ops, undefined, 2));
	// });

	//Insert new doc into Users (name, age, location)

	// db.collection('Users').insertOne({
	// 	name: 'Kowshik',
	// 	age: 20,
	// 	location: 'SF'
	// }, (err, result) => {
	// 	if (err) {
	// 		return console.log('* unable to insert user', err);
	// 	}

	// 	console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
	// })

	db.close();
});
