const io = require('socket.io-client');

// message, user 모듈
const formatMessage = require('../utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('../utils/users');

// ChatApp 시스템 이름을 변수에 할당 (단순하게 시스템 메세지 보내는 용도)
const botName = 'ChatApp bot';

const handleChatMessage = async (socket, coll) => {
  const user = getCurrentUser(socket.id);

  const message = {
    username: user.username,
    socketId: socket.id,
    room: user.room,
    message: msg,
    time: socket.handshake.time
  };

  try {
    await coll.insertOne(message);
    console.log('Message inserted into MongoDB');

    io.to(user.room).emit('message', formatMessage(user.username, msg));

  } catch (err) {
    console.error('Error inserting message:', err);
  }
};

const handleJoinRoom = (socket) => {
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
};

const handleDisconnect = socket => {
  // 클라이언트가 연결이 끊어졌을 때 실행
  // 소켓 연결이 끊긴 사용자를 식별하고, 해당 사용자가 속한 채팅방에 메시지를 전송, 사용자 목록 업데이트
  socket.on('disconnect', () => {

    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit('message', formatMessage(botName, `${user.username} has left the chat`));
    
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });

      console.log(`${user.username} has left the ${user.room}`);
    };

  });
};

module.exports = {
  handleChatMessage,
  handleJoinRoom,
  handleDisconnect
};
