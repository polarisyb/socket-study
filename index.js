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

// 웹 소켓 연결 시
io.on('connection', function(socket){
   console.log('A user connected');

   // 연결 종료 시 - 새로고침시 disconnected 문구와 A use connected 문구가 차례로 출력
   socket.on('disconnect', () => {
      console.log('disconnected');
   });
   
   // app.js 의 startGame 이벤트 수신 시 - startGame 버튼 클릭 시 동작 
   socket.on('startGame', () => {
      console.log('Game started');
      io.sockets.emit('게임을 시작합니다');
   });

   // app.js 의 home 이벤트 수신 시 - home 버튼 클릭 시 동작
   // 그리고 이를 송신자를 제외한 모든 사용자에게 전달한다.
   socket.on('home', () => {
      console.log('home button pressed');
      io.emit('home');
   });

   // app.js 의 crazyIsClicked 이벤트 수신 시 - 개체 클릭 시 동작
   // data 인자로 개체의 랜덤 좌표를 받는다.
   socket.on('crazyIsClicked', data => {
      // 송신자를 제외한 서버에 접속해 있는 모든 사용자에게 이벤트를 전달한다.
      // io.emit('crazyIsClicked', data);

      // 송신자에게만 이벤트 전달
      socket.emit('crazyIsClicked', data);
   });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

