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

// namespace 설정
// namespace 설정 시 index.html script 태그 내 socket io 매개변수로 /my-namespace 를 받아야 함. 
let nsp = io.of('/my-namespace');
nsp.on('connection', socket => {
  console.log('someone connected');
  nsp.emit('hi', 'hello everyone!');
});

// 웹 소켓 연결 시
io.on('connection', socket => {
  console.log('a user connected');
  
  let clients = 0;
  clients++;
  io.sockets.emit('broadcast', { description: clients + ' clients connected!'});

  // 클라이언트로부터 메세지 수신
  socket.on('chat message', msg => {
    console.log('message: ' + msg);
    socket.emit('chat message', msg);
  });
  
  // 연결 종료 시 - 브라우저 새로 고침시 client disconnected 문구 다음 a user connected 문구 출력
  socket.on('disconnect', () => {
    console.log('client disconnected');

    clients--;
    io.sockets.emit('broadcast', { description: clients + ' clients connected!'});
  });

  // 에러 시
  socket.on('error', error => {
    console.error(error);
  });

  // 클라이언트에서 보낸 이벤트를 받았을 때
  socket.on('clientEvent', (data) => {
    console.log(data)
  });

  io.sockets.emit('broadcast', { description: clients + ' clients connected!'});

  // let roomno = 1;
  // socket.join("room-"+roomno);
  // // room 내에 있는 모두에게 이 이벤트를 보냄
  // io.sockets.in("room-"+roomno).emit('connectToRoom', "You are in room no. "+roomno);

});

// io.emit('some event', { someProperty: 'some value', otherProperty: 'other value' }); // This will emit the event to all connected sockets

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


/*
  메세지 주고 받기 - 이벤트 기반

  메세지 전송
  이벤트 발생: socket.emit();
  socket.emit('EVENT', data); EVENT = 이벤트 이름 , data = 보내는 데이터 (데이터가 없으면 생략 가능)

  메세지 수신
  이벤트 리스터 등록 : socket.on();
  socket.on('EVENT', functiona(data){}); 함수 형태로 data
*/



