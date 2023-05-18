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
  console.log('index 페이지 입니다.');
});

app.get('/remote', (req, res) => {
  res.sendFile(path.join(__dirname + '/remote.html'));
  console.log('remote 페이지 입니다.');
});

// 웹 소켓 연결 시
io.on('connection', socket => {
   console.log('A user connected');

   // 연결 종료 시 - 새로고침시 disconnected 문구와 A use connected 문구가 차례로 출력
   socket.on('disconnect', () => {
      console.log('disconnected');
   });

});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

