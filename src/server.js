import express from 'express';
import http from 'http';
import path from 'path';

const app = express();
const server = http.createServer(app);

app.use(express.static(path.resolve(__dirname, '..', 'public')));

app.get('/', (req, res) => {
  res.render('../public/index.html');
});

server.listen(3333, () =>
  console.log('Server running on http://localhost:3333 ...'),
);
