const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 8000;
require('dotenv').config();

/* socketEvents 모듈 */
const socketEvents = require('./socket/socketEvents');

/* db 모듈 */
const validateMongoDBUri = require('./db/UriValidator');

// const createCollection = require('./db/createCollection');
const listDatabases = require('./db/listDatabases');
// const deleteRoomMessage = require('./db/deleteRoomMessage');

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

    await client.db('admin').command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    await listDatabases(client);

  } catch (err) {
    console.error('Error:', err);
  };
};

// connection 이 수립되면 event handler function의 인자로 socket이 들어온다.
io.on('connection', socket => {
  console.log(`${socket.id} is connected`);

  run(socket, client).catch(console.dir);

  // deleteRoomMessage(client, 'JavaScript');
  
  socket.onAny( e => {
    console.log(`Socket Event: ${e}`);
  });

  const db = client.db('Chat-app');
  const coll = db.collection('message');

  socketEvents.handleChatMessage(socket, io, coll);
  socketEvents.handleJoinRoom(socket, io);
  socketEvents.handleDisconnect(socket, io);

  socket.on('disconnect', () => {
    console.log(`${socket.id} is disconnected`);
  });
});

server.listen(PORT, err => { 
  if (err) throw err;
  console.log(`Server running on port ${PORT}`);
});