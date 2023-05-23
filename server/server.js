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

  io.emit('joinMessage', `${socket.id} has joined the chat`);

  // room에 입장했을 때
  socket.on('joinRoom', data => {
    socket.join(data);
    console.log(`${socket.id} has joined the ${data}`)
    socket.broadcast.to(data).emit('message', `${socket.id} has joined the ${data}`);
  });

  // MyForm 으로 부터 sendMessage 이벤트를 받았을 때
  socket.on('sendMessage', msg => {
    io.emit('message', msg);
    console.log(`${socket.id} send to message : ${msg}`);
  });

  socket.emit('foo', ['Hello from the server'] );

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(PORT, err => {
  if (err) throw err;
  console.log(`Server running on port ${PORT}`);
});
