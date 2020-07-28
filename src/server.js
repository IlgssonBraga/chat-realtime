import express from 'express';
import http from 'http';
import socketio from 'socket.io';
import path from 'path';

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.resolve(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.render('../public/index.html');
});

let count = 0;

io.on('connection', socket => {
  console.log('New web socket connection');

  socket.emit('countUpdated', count);

  socket.on('increment', () => {
    count += 1;

    // socket.emit('countUpdated', count);
    io.emit('countUpdated', count);
  });
});

server.listen(3333, () =>
  console.log('Server running on http://localhost:3333 ...'),
);
