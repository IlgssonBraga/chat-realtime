import express from 'express';
import http from 'http';
import path from 'path';
import socketio from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.resolve(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.render('../public/index.html');
});

io.on('connection', () => {
  console.log('New web socket connection');
});

server.listen(3333, () =>
  console.log('Server running on http://localhost:3333 ...'),
);
