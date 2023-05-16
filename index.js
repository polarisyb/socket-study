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

users = [];
io.on('connection', function(socket){
   console.log('A user connected');
   socket.on('setUsername', function(data){
      console.log(data);
      if(users.indexOf(data) > -1){
         socket.emit('userExists', data + ' username is taken! Try some other username.');
      } else {
         users.push(data);
         socket.emit('userSet', {username: data});
      }
   });
   socket.on('msg', function(data){
      //Send message to everyone
      io.sockets.emit('newmsg', data);
   })
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



