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
  console.log(`User Connected: ${socket.id}`);

  socket.on('joinRoom', data => {
    socket.join(data);
  });

  socket.on('sendMessage', data => {
    console.log(data);
    io.to(data.room).emit('receiveMessage', data);
  });


  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(PORT, err => {
  if (err) throw err;
  console.log(`Server running on port ${PORT}`);
});
