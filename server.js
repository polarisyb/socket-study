const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const io = require('socket.io')(server);
// const { Server } = require('socket.io');
// const io = new Server(server);
const PORT = process.env.PORT || 8000;
require('dotenv').config();

/* message, user 모듈 */
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');


/* db 모듈 */

// uri 유효성 검사
const validateMongoDBUri = require('./db/UriVaildator');

// 새로운 db와 컬렉션 생성
// const createCollection = require('./db/createCollection');
const listDatabases = require('./db/listDatabases');

// ChatApp 시스템 이름을 변수에 할당 (단순하게 시스템 메세지 보내는 용도)
const botName = 'ChatApp bot';

// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

/* mongoDB 연결 */
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI;
validateMongoDBUri(uri); // MongoDB URI 유효성 검사

const client = new MongoClient(uri, {
  serverApi: {
    // ServerApiVersion.v1을 사용하여 버전 1의 서버 API를 사용하도록 지정
    version: ServerApiVersion.v1,
    // strict 옵션은 엄격한 모드를 활성화하는데 사용.
    // MongoDB 서버의 응답이 예상된 스키마와 일치하는지 확인하고, 일치하지 않으면 오류를 발생시킴
    strict: true,
    // deprecationErros 옵션은 mongoDB  기능이 더 이상 권장되지 않는 경우 오류를 발생시키도록 설정
    // 이를 통해 더 이상 사용되지 않는 기능을 감지하고 업데이트 할 수 있다.
    deprecationErrors: true,
  }
});

const run = async (socket, client) => {
  try {

    await client.connect();

    const db = client.db('Chat-app');
    const coll = db.collection('message');

    socket.on('chatMessage', async msg => {
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
    });

    await listDatabases(client);

  } catch (err) {
    console.error('Error:', err);
  }
};

// connection 이 수립되면 event handler function의 인자로 socket이 들어온다.
io.on('connection', socket => {
  // socket 에서 송수신되는 모든 이벤트에 대한 리스너를 설정한다.
  // 이벤트 이름을 명시적으로 지정하지 않고 모든 이벤트를 수신할 수 있는 특별한 메서드
  run(socket, client).catch(console.dir);

  socket.onAny( e => {
    console.log(`Socket Event: ${e}`);
  });

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
});

server.listen(PORT, err => { 
  if (err) throw err;
  console.log(`Server running on port ${PORT}`);
});