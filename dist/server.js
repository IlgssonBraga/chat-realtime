"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }/* eslint-disable consistent-return */
var _express = require('express'); var _express2 = _interopRequireDefault(_express);
var _http = require('http'); var _http2 = _interopRequireDefault(_http);
var _socketio = require('socket.io'); var _socketio2 = _interopRequireDefault(_socketio);
var _path = require('path'); var _path2 = _interopRequireDefault(_path);
var _badwords = require('bad-words'); var _badwords2 = _interopRequireDefault(_badwords);
var _messages = require('./utils/messages');
var _users = require('./utils/users');

const app = _express2.default.call(void 0, );
const server = _http2.default.createServer(app);
const io = _socketio2.default.call(void 0, server);

app.use(_express2.default.static(_path2.default.resolve(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.render('../public/index.html');
});

io.on('connection', socket => {
  console.log('New web socket connection');

  socket.on('join', (options, callback) => {
    const { error, user } = _users.addUser.call(void 0, { id: socket.id, ...options });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit('message', _messages.generateMessage.call(void 0, 'Admin', 'Welcome'));
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        _messages.generateMessage.call(void 0, 'Admin', `${user.username} has joined!`),
      );

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: _users.getUsersInRoom.call(void 0, user.room),
    });

    callback();
  });

  // socket.emit, io.emit, socket.broadcast.emit
  // io.to.emit, socket.broadcast.to.emit

  socket.on('sendMessage', (message, callback) => {
    const filter = new (0, _badwords2.default)();

    const user = _users.getUser.call(void 0, socket.id);

    if (filter.isProfane(message)) {
      return callback('Palavras impróprias não são permitidas!');
    }

    io.to(user.room).emit('message', _messages.generateMessage.call(void 0, user.username, message));
    callback();
  });

  socket.on('disconnect', () => {
    const user = _users.removeUser.call(void 0, socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        _messages.generateMessage.call(void 0, 'Admin', `${user.username} has left!`),
      );
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: _users.getUsersInRoom.call(void 0, user.room),
      });
    }
  });

  socket.on('sendLocation', ({ latitude, longitude }, callback) => {
    const user = _users.getUser.call(void 0, socket.id);

    io.to(user.room).emit(
      'locationMessage',
      _messages.generateLocationMessage.call(void 0, 
        user.username,
        `https://www.google.com.br/maps?q=${latitude},${longitude}`,
      ),
    );

    callback();
  });
});

server.listen(3333, () =>
  console.log('Server running on http://localhost:3333 ...'),
);
