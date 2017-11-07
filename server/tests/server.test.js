const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
	_id: new ObjectID(),
	text: "First test todo"
}, {
	_id: new ObjectID(),
	text: "Second test todo",
	completed: true,
	completedAt: 333
}];

// sets up something before the tests are run - in this case we want to empty the database
beforeEach((done) => {
	Todo.remove({}).then(() => {
		return Todo.insertMany(todos);
	}).then(() => done());
});

describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		var text = 'Test todo text';

		request(app)
			.post('/todos')
			.send({text})
			.expect(200)
			.expect((response) => {
				expect(response.body.text).toBe(text);
			})
			.end((error, response) => {
				if (error) {
					return done(error);
				}

				Todo.find({text}).then((todos) => {
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch((error) => done(error));
		});
	});

	it('should not create todo with invalid body data', (done) => {

		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end((error, response) => {
				if (error) {
					return done(error);
				}

				Todo.find({}).then((todos) => {
					expect(todos.length).toBe(2);
					done();
				}).catch((error) => done(error));
			});
	});
});


describe('GET /todos', () => {
	it('should get all todos', (done) => {
		request(app)
			.get('/todos')
			.expect(200)
			.expect((response) => {
				expect(response.body.length).toBe(2);
			})
			.end(done);
	});
});


describe('GET /todos/:id', () => {
	it('should get the todo doc', (done) => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect((response) => {
				expect(response.body.todo.text).toBe(todos[0].text);
			})
			.end(done);
	});

	it('should return a 404 if todo not found', (done) => {
		request(app)
		.get(`/todos/${new ObjectID().toHexString()}`)
		.expect(404)
		.end(done);
	});

	it('should return 404 for non-object ids', (done) => {
		request(app)
		.get(`/todos/${new ObjectID()}`)
		.expect(404)
		.end(done);
	});
});

describe('DELETE /todos/:id', () => {
	it('should delete the todo', (done) => {
		var hexId = todos[0]._id.toHexString();

		request(app)
		.delete(`/todos/${hexId}`)
		.expect(200)
		.expect((response) => {
			expect(response.body.todo._id).toBe(hexId);
		})
		.end((err, response) => {
			if (err) {
				return done(err);
			}
			Todo.findById(hexId).then((todo) => {
				expect(todo).toNotExist();
				done();
			}).catch((e) => done(e));
		});
	});

	it('should return 404 if todo is not found', (done) => {
		request(app)
		.delete(`/todos/${new ObjectID().toHexString()}`)
		.expect(404)
		.end(done);
	});

	it('should return 404 for non-object ids', (done) => {
		request(app)
		.delete(`/todos/${new ObjectID()}`)
		.expect(404)
		.end(done);
	});

});


describe('PATCH /todos/:id', () => {
	it('should update the todo', (done) => {
		var hexId = todos[0]._id.toHexString();
		var text = "Update from test";

		request(app)
		.patch(`/todos/${hexId}`)
		.send({text, completed: true})
		.expect(200)
		.expect((response) => {
			expect(response.body.todo.text).toBe(text);
			expect(response.body.todo.completed).toBe(true);
			expect(response.body.todo.completedAt).toBeA('number');
		})
		.end(done);
	});

	it('should clear completedAt when todo is not completed ', (done) => {
		var hexId = todos[1]._id.toHexString();
		request(app)
		.patch(`/todos/${hexId}`)
		.send({completed: false})
		.expect(200)
		.expect((response) => {
			expect(response.body.todo.completed).toBe(false);
			expect(response.body.todo.completedAt).toNotExist();
		})
		.end(done);
	});

	it('should return 404 if todo is not found', (done) => {
		request(app)
		.patch(`/todos/${new ObjectID().toHexString()}`)
		.send({})
		.expect(404)
		.end(done);
	});

	it('should return 404 for non-object ids', (done) => {
		request(app)
		.patch(`/todos/${new ObjectID()}`)
		.send({})
		.expect(404)
		.end(done);
	});

});
