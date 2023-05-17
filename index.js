const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
// const { Server } = require('socket.io');
// const io = new Server(server);
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static('public'));

io.on('connection', function(socket){
   console.log('A user connected');

   socket.on('disconnect', () => {
      console.log('disconnected');
   });
   socket.on('startGame', () => {
      console.log('Game started');
      io.sockets.emit('게임을 시작합니다');
   });
   socket.on('home', () => {
      console.log('home button pressed');
      io.emit('home');
   });
   socket.on('crazyIsClicked', data => {
      io.emit('crazyIsClicked', data);
   });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

