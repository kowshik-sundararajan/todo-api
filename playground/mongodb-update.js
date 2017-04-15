//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
	if (err) {
		return console.log('* unable to connect to the database server');
	}

	console.log('* connected to database server');

	/* 
		findOneAndUpdate (filter, update, option, callback)
		- filter: the document to be updated
		- update: the updates
		- option: eg: returnOriginal is default set true and returns the old document

		Use mongodb update operators
	*/
	db.collection('Todos').findOneAndUpdate({
		_id: new ObjectID('58f13a803ee808194bdedcab')
	}, {
		$set: {
			completed: true
		}
	}, {
		returnOriginal: false
	}).then((result) => {
		console.log(result);
	});

	/* 
		Updating user with multiple mongodb operators
		- the inc operator works as: $inc: {field_to_be_update: incremental_value}
	*/
	db.collection('Users').findOneAndUpdate({
		_id: new ObjectID('58f13d6034cb851a29af71d2')
	}, {
		$set: {
			name: 'Kowshik'
		},
		$inc: {
			age: 1
		}
	}, {
		returnOriginal: false
	}).then((result) => {
		console.log(JSON.stringify(result, undefined, 2));
	});


	//db.close();
});
