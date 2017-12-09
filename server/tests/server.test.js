const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');

const {todos, users, populateTodos, populateUsers} = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);


describe('POST /todos', () => {
	it('should create a new todo', (done) => {
		var text = 'Test todo text';

		request(app)
			.post('/todos')
			.set('x-auth', users[0].tokens[0].token)
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
			.set('x-auth', users[0].tokens[0].token)
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
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((response) => {
				expect(response.body.length).toBe(1);
			})
			.end(done);
	});
});


describe('GET /todos/:id', () => {
	it('should get the todo doc', (done) => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((response) => {
				expect(response.body.todo.text).toBe(todos[0].text);
			})
			.end(done);
	});

	it('should return a 404 if todo not found', (done) => {
		request(app)
		.get(`/todos/${new ObjectID().toHexString()}`)
		.set('x-auth', users[0].tokens[0].token)
		.expect(404)
		.end(done);
	});

	it('should return 404 for non-object ids', (done) => {
		request(app)
		.get(`/todos/${new ObjectID()}`)
		.set('x-auth', users[0].tokens[0].token)
		.expect(404)
		.end(done);
	});

	it('should not return a todo doc created by another user', (done) => {
		request(app)
			.get(`/todos/${todos[1]._id.toHexString()}`)
			.set('x-auth', users[0].tokens[0].token)
			.expect(404)
			.end(done);
	});
});

describe('DELETE /todos/:id', () => {
	it('should delete the todo', (done) => {
		var hexId = todos[0]._id.toHexString();

		request(app)
		.delete(`/todos/${hexId}`)
		.set('x-auth', users[0].tokens[0].token)
		.expect(200)
		.expect((response) => {
			expect(response.body.todo._id).toBe(hexId);
		})
		.end((err, response) => {
			if (err) {
				return done(err);
			}
			Todo.findById(hexId).then((todo) => {
				expect(todo).toBeFalsy();
				done();
			}).catch((e) => done(e));
		});
	});

	it('should return 404 if todo is not found', (done) => {
		request(app)
		.delete(`/todos/${new ObjectID().toHexString()}`)
		.set('x-auth', users[1].tokens[0].token)
		.expect(404)
		.end(done);
	});

	it('should return 404 for non-object ids', (done) => {
		request(app)
		.delete(`/todos/${new ObjectID()}`)
		.set('x-auth', users[0].tokens[0].token)
		.expect(404)
		.end(done);
	});

	it('should not delete a todo created by another user', (done) => {
		var hexId = todos[1]._id.toHexString();
		request(app)
		.delete(`/todos/${hexId}`)
		.set('x-auth', users[0].tokens[0].token)
		.expect(404)
		.end((err, response) => {
			if (err) {
				return done(err);
			}
			Todo.findById(hexId).then((todo) => {
				expect(todo).toBeTruthy();
				done();
			}).catch((e) => done(e));
		});
	});
});


describe('PATCH /todos/:id', () => {
	it('should update the todo', (done) => {
		var hexId = todos[0]._id.toHexString();
		var text = "Update from test";

		request(app)
		.patch(`/todos/${hexId}`)
		.set('x-auth', users[0].tokens[0].token)
		.send({text, completed: true})
		.expect(200)
		.expect((response) => {
			expect(response.body.todo.text).toBe(text);
			expect(response.body.todo.completed).toBe(true);
			//expect(response.body.todo.completedAt).toBeA('number');
			expect(typeof response.body.todo.completedAt).toBe('number');
		})
		.end(done);
	});

	it('should clear completedAt when todo is not completed ', (done) => {
		var hexId = todos[1]._id.toHexString();
		request(app)
		.patch(`/todos/${hexId}`)
		.set('x-auth', users[1].tokens[0].token)
		.send({completed: false})
		.expect(200)
		.expect((response) => {
			expect(response.body.todo.completed).toBe(false);
			expect(response.body.todo.completedAt).toBeFalsy();
		})
		.end(done);
	});

	it('should return 404 if todo is not found', (done) => {
		request(app)
		.patch(`/todos/${new ObjectID().toHexString()}`)
		.set('x-auth', users[0].tokens[0].token)
		.send({})
		.expect(404)
		.end(done);
	});

	it('should return 404 for non-object ids', (done) => {
		request(app)
		.patch(`/todos/${new ObjectID()}`)
		.set('x-auth', users[0].tokens[0].token)
		.send({})
		.expect(404)
		.end(done);
	});

	it('should not update a todo created by another user ', (done) => {
		var hexId = todos[1]._id.toHexString();
		var text = "Update from test";

		request(app)
		.patch(`/todos/${hexId}`)
		.set('x-auth', users[0].tokens[0].token)
		.send({text, completed: true})
		.expect(404)
		.end(done);
	});

});


describe('GET /users/me', () => {
	it('should return user if authenticated', (done) => {
		request(app)
			.get('/users/me')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((response) => {
				expect(response.body._id).toBe(users[0]._id.toHexString());
				expect(response.body.name).toBe(users[0].name);
				expect(response.body.email).toBe(users[0].email);
			})
			.end(done);
	});

	it('should return 401 if not authenticated', (done) => {
		request(app)
		.get('/users/me')
		.expect(401)
		.expect((response) => {
			expect(response.body).toEqual({});
		})
		.end(done);
	});
});

describe('POST /users', () => {
	it('should create a user', (done) => {
		var name = 'Test User';
		var email = 'example@example.com';
		var password = '123mnb!';

		request(app)
			.post('/users')
			.send({name, email, password})
			.expect(200)
			.expect((response) => {
				expect(response.headers['x-auth']).toBeTruthy();
				expect(response.body.user._id).toBeTruthy();
				expect(response.body.user.name).toBe(name);
				expect(response.body.user.email).toBe(email);
			})
			.end((error) => {
				if (error) {
					return done(error);
				}

				User.findOne({email}).then((user) => {
					expect(user).toBeTruthy();
					expect(user.password).not.toBe(password);
					done();
				})
				.catch((error) => done(error));
			});
	});

	it('should return validation error if request is invalid', (done) => {
		var name = 'Test User';
		var email = 'email';
		var password = '123';

		request(app)
			.post('/users')
			.send({name, email, password})
			.expect(400)
			.end(done);
	});

	it('should not create user if email is in use', (done) => {
		var name = 'Test User';
		var email = users[0].email;
		var password = '123mnb!';

		request(app)
			.post('/users')
			.send({name, email, password})
			.expect(400)
			.end(done);
	});
});


describe('POST /users/login', () => {
	it('should login user and return auth token', (done) => {
		var email = users[1].email;
		var password = users[1].password;

		request(app)
			.post('/users/login')
			.send({email, password})
			.expect(200)
			.expect((response) => {
				expect(response.headers['x-auth']).toBeTruthy();
				expect(response.body.user.email).toBe(email);
			})
			.end((error, response) => {
				if (error) {
					return done(error)
				}

				User.findById(users[1]._id).then((user) => {
					expect(user.toObject().tokens[1]).toMatchObject({
						access: 'auth',
						token: response.headers['x-auth']
					});
					done();
				})
				.catch((error) => done(error));
			})
	});

	it('should reject invalid login', (done) => {
		var email = users[1].email;
		var password = '123456';

		request(app)
			.post('/users/login')
			.send({email, password})
			.expect(400)
			.expect((response) => {
				expect(response.headers['x-auth']).toBeFalsy();
			})
			.end((error, response) => {
				if (error) {
					return done(error);
				}

				User.findById(users[1]._id).then((user) => {
					expect(user.tokens.length).toBe(1);
					done();
				})
				.catch((error) => done(error));
			});
	});
});


describe('DELETE /users/me/token/', () => {
	it('should delete user token if authenticated', (done) => {

		request(app)
			.delete('/users/me/token')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.end((error, response) => {
				if (error) {
					return done(error);
				}

				User.findById(users[0]._id).then((user) => {
					expect(user.tokens.length).toBe(0);
					done();
				})
				.catch((error) => done(error));
			});
	});

	it('should return 401 if not authenticated', (done) => {

		request(app)
			.delete('/users/me/token')
			.expect(401)
			.end(done);
	});
});
