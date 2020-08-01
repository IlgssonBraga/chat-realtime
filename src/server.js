/* eslint-disable consistent-return */
import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import path from 'path';
import Filter from 'bad-words';
import { generateMessage, generateLocationMessage } from './utils/messages';
import { addUser, getUser, removeUser, getUsersInRoom } from './utils/users';

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.resolve(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.render('../public/index.html');
});

io.on('connection', socket => {
  console.log('New web socket connection');

  socket.on('join', (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);

    socket.emit('message', generateMessage('Admin', 'Welcome'));
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        generateMessage('Admin', `${user.username} has joined!`),
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

server.listen(3333, () =>
  console.log('Server running on http://localhost:3333 ...'),
);
