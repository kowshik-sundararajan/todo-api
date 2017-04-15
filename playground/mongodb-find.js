//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('* unable to connect to the database server');
	}

	console.log('* connected to database server');

	/* To fetch all the todos 
		- find just returns a mongo cursor that can be used
		- the arguments in find is the query - as key value pairs
		- toArray converts the results as an array, returns docs as successful arg
		- find is a promise that can print the results in then()
		- ObjectID is required to query by id because the id is an ObjectID not just a string
	*/

	// db.collection('Todos').find({
	// 	_id: new ObjectID('58f13a803ee808194bdedcab')
	// }).toArray().then((docs) => {
	// 	console.log(JSON.stringify(docs, undefined, 2));
	// }, (err) => {
	// 	console.log('* unable to fetch todos', err);
	// });

	// Query for the number of documents, returns count as successful arg
	// db.collection('Todos').find().count().then((count) => {
	// 	console.log(`Todos count: ${count}`);
	// }, (err) => {
	// 	console.log('* unable to fetch todos', err);
	// });

	// Query for a user by name
	db.collection('Users').find({name: 'Kowshik'}).toArray().then((docs) => {
		console.log(JSON.stringify(docs, undefined, 2));
	}, (err) => {
		console.log('* unable to fetch user', err);
	})

	// db.close();
});
