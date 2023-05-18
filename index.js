const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const io = require('socket.io')(server);
// const { Server } = require('socket.io');
// const io = new Server(server);
const PORT = process.env.PORT || 8000;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

io.on('connection', socket => {
  console.log('a user connected');

  socket.on('chat message', msg => {
    
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
  });

});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

