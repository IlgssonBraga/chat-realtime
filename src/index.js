/* eslint-disable consistent-return */
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');
const Filter = require('bad-words');
const {
  generateMessage,
  generateLocationMessage,
} = require('./utils/messages');
const {
  addUser,
  getUser,
  removeUser,
  getUsersInRoom,
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.resolve(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.render('../public/index.html');
});

// client.on('connection', socket => {
//   const clientIpAddress = socket.request.socket.remoteAddress;
//   console.log(clientIpAddress);
// });

io.on('connection', socket => {
  // eslint-disable-next-line no-underscore-dangle
  console.log('connection :', socket.request.connection._peername);
  const namez = socket.request.connection.remoteAddress;
  console.log(namez);

  socket.on('join', (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit('message', generateMessage('Admin', 'Welcome'));
    socket.broadcast.to(user.room).emit(
      'message',
      generateMessage(
        'Admin',
        // eslint-disable-next-line no-underscore-dangle
        `${user.username} ${namez}  has joined!`,
      ),
    );

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  // socket.emit, io.emit, socket.broadcast.emit
  // io.to.emit, socket.broadcast.to.emit

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();

    const user = getUser(socket.id);

    if (filter.isProfane(message)) {
      return callback('Palavras impróprias não são permitidas!');
    }

    io.to(user.room).emit('message', generateMessage(user.username, message));
    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        generateMessage('Admin', `${user.username} has left!`),
      );
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });

  socket.on('sendLocation', ({ latitude, longitude }, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit(
      'locationMessage',
      generateLocationMessage(
        user.username,
        `https://www.google.com.br/maps?q=${latitude},${longitude}`,
      ),
    );

    callback();
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log('Server running! ...'));
