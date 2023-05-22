const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const server = http.createServer(app);
const PORT = process.env.PORT || 8000;
const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  }
});

app.use(cors());

server.listen(PORT, err => {
  if (err) throw err;
  console.log(`Server running on port ${PORT}`);
});

