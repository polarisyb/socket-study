const express = require('express');
const app = express();
const http = require('http');
const cors = require('cors');
const server = http.createServer(app);
const PORT = process.env.PORT || 8000;

app.use(cors());

const io = require('socket.io')(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  }
});

io.on('connection', socket => {
  socket.onAny( e => {
    console.log(`Socket Event: ${e}`);
  });

  console.log(`User Connected: ${socket.id}`);

  socket.on('joinRoom', data => {
    socket.join(data);
    console.log(socket.rooms);
  });

  socket.on('sendMessage', value => {
    console.log(`${socket.id} send to message : ${value}`);
  });

  socket.emit('foo', ['Hello from the server'] );

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(PORT, err => {
  if (err) throw err;
  console.log(`Server running on port ${PORT}`);
});
