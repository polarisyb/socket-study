const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const io = require('socket.io')(server);
// const { Server } = require('socket.io');
// const io = new Server(server);
const PORT = process.env.PORT || 8000;
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

// ChatApp 시스템 이름을 변수에 할당 (단순하게 시스템 메세지 보내는 용도)
const botName = 'ChatApp bot';

// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

// connection 이 수립되면 event handler function의 인자로 socket이 들어온다.
io.on('connection', socket => {
  // socket 에서 송수신되는 모든 이벤트에 대한 리스너를 설정한다.
  // 이벤트 이름을 명시적으로 지정하지 않고 모든 이벤트를 수신할 수 있는 특별한 메서드
  socket.onAny( e => {
    console.log(`Socket Event: ${e}`);
  });
  // console.log(io.of("/").adapter);

  // 클라이언트가 Room에 접속했을 때
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    socket.emit('message', formatMessage(botName, "Welcome to ChatCord!"));

    // 클라이언트가 room에 입장했을 때 broadcast 방식으로 이벤트 송신
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // 클라이언트가 room에 입장했을 때 입장한 room에 'roomUsers' 이벤트 송신
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // chatMessage 이벤트 수신
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });
  
  // 클라이언트가 연결이 끊어졌을 때 실행
  // message 이벤트를 내보내서 room 의 다른 사용자에게 알리고
  // 'roomUsers' 이벤트를 내보내 룸의 사용자 목록을 업데이트 한다.
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
    
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    };

  });
});

server.listen(PORT, err => { 
  if (err) throw err;
  console.log(`Server running on port ${PORT}`);
});

