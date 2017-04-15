//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('* unable to connect to the database server');
	}

	console.log('* connected to database server');

	/*
		deleteMany documents
	*/
	db.collection('Todos').deleteMany({text:'DxE Speakout'}).then((result) => {
		console.log(result);
	});

	/* 
		deleteOne document 
		- will target only the first document it encounters
	*/
	db.collection('Todos').deleteOne({text: 'DxE Speakout'}).then((result) => {
		console.log(result);
	});

	/* 
		findOneAndDelete 
		- will target only the first document it encounters 
		- different from deleteOne, because it returns the deleted document
		
	*/
	db.collection('Todos').findOneAndDelete({text: 'DxE Speakout'}).then((result) => {
		console.log(result);
	})

	
	// Delete all users documents with name Kowshik
	db.collection('Users').deleteMany({name: 'Kowshik'});

	// Find user with that id, delete that document and return it
	db.collection('Users').findOneAndDelete({
		_id: new ObjectID('58f13d6d4913ef1a2f58047e')
	}).then((results) => {
		console.log(JSON.stringify(results, undefined, 2));
	});

	//db.close();
});
