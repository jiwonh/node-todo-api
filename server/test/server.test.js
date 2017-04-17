const expect = require('expect');
const request = require('supertest');
const {app} = require('./../server');
const {Todo} = require('./../models/Todo');
const {User} = require('./../models/User');
const {ObjectId} = require('mongodb');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

// remove todos in mongodb and add seed data to mongodb
beforeEach(populateTodos);
beforeEach(populateUsers);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .set({'x-auth': users[0].tokens[0].token})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        // check new todo saved in db
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((err) => done(err));
      });
  });

  it ('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .set({'x-auth': users[0].tokens[0].token})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((err) => done(err));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
      request(app)
        .get('/todos')
        .set({'x-auth': users[0].tokens[0].token})
        .expect(200)
        .expect((res) => {
            expect(res.body.todos.length).toBe(1);
        })
        .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('shoud return todo doc by id', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set({'x-auth': users[0].tokens[0].token})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('shoud not return todo doc created by other user', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set({'x-auth': users[0].tokens[0].token})
      .expect(404)
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectId().toHexString();

    request(app)
      .get(`/todos/${hexId}`)
      .set({'x-auth': users[0].tokens[0].token})
      .expect(404)
      .end(done);
  });

  it('should return 404 id non-object ids', (done) => {
    request(app)
      .get('/todos/123')
      .set({'x-auth': users[0].tokens[0].token})
      .expect(404)
      .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should remove a todo', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set({'x-auth': users[1].tokens[0].token})
      .expect(200)
      .expect((res) => {
        expect(res.body.todo._id).toBe(hexId);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toNotExist();
          done();
        }).catch((err) => done(err));
      });
  });

  it('should not remove a todo if created by other user', (done) => {
    var hexId = todos[1]._id.toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set({'x-auth': users[0].tokens[0].token})
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.findById(hexId).then((todo) => {
          expect(todo).toExist();
          done();
        }).catch((err) => done(err));
      });
  });

  it('should return 404 if todo not found', (done) => {
    var hexId = new ObjectId().toHexString();

    request(app)
      .delete(`/todos/${hexId}`)
      .set({'x-auth': users[0].tokens[0].token})
      .expect(404)
      .end(done);
  });

  it('should return 404 if object id is invalid', (done) => {
    request(app)
      .delete('/todos/123')
      .set({'x-auth': users[0].tokens[0].token})
      .expect(404)
      .end(done);
  });
});

describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    var hexId = todos[1]._id.toHexString();
    var updateTodo = {
      text: 'Updated text',
      completed: true
    };

    request(app)
      .patch(`/todos/${hexId}`)
      .set({'x-auth': users[1].tokens[0].token})
      .send(updateTodo)
      .expect(200)
      // check response data to be correct
      .expect((res) => {
        expect(res.body.todo.text).toBe(updateTodo.text);
        expect(res.body.todo.completed).toBe(updateTodo.completed);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }
        // check db is updated too
        Todo.findById(hexId).then((todo) => {
          expect(todo.text).toBe(updateTodo.text);
          expect(todo.completed).toBe(updateTodo.completed);
          expect(todo.completedAt).toBeA('number');
          done();
        }).catch((err) => done(err));
      });
  });

  it('should not update the todo if created by other user', (done) => {
    var hexId = todos[1]._id.toHexString();
    var updateTodo = {
      text: 'Updated text',
      completed: true
    };

    request(app)
      .patch(`/todos/${hexId}`)
      .set({'x-auth': users[0].tokens[0].token})
      .send(updateTodo)
      .expect(400)
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    var id = todos[1]._id;
    var updateTodo = {
      completed: false
    };

    request(app)
      .patch(`/todos/${id}`)
      .set({'x-auth': users[1].tokens[0].token})
      .send(updateTodo)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err);
        }
        Todo.findById(id).then((todo) => {
          expect(todo.completedAt).toNotExist();
          done();
        }).catch((err) => done(err));
      });
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set({'x-auth': users[0].tokens[0].token})
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toString());
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /users', () => {
  it('should create a user', (done) => {
    var email = 'john@example.com';
    var password = 'abc123';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(email);
      })
      .end((err, res) => {
        if (err) {
          done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(password);
          done();
        }).catch((err) => done(err));
      });
  });

  it('should return validation error if request invalid', (done) => {
    var email = 'john';
    var password = '123';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .expect((res) => {
        expect(res.body.name).toBe('ValidationError');
      })
      .end(done);
  });

  it('should not create user if email in user', (done) => {
    var email = users[0].email;
    var password = 'abc123';

    request(app)
      .post('/users')
      .send({email, password})
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
      .expect((res) => {
        expect(res.headers['x-auth']).toExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          var lastTokenIndex = user.tokens.length - 1;
          expect(user.tokens[lastTokenIndex]).toInclude({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((err) => done(err));
      });
  });

  it('should reject invalid login', (done) => {
    var email = 'jiwon@example.com';
    var password = 'incorrectPassword';

    request(app)
      .post('/users/login')
      .send(email, password)
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end(done);
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set({'x-auth': users[0].tokens[0].token})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toNotExist();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((err) => done(err));
      });
  });
});
