const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const io = require('socket.io')(server);
// const { Server } = require('socket.io');
// const io = new Server(server);
const PORT = process.env.PORT || 8000;

// app.use(path, callback)
// path: 미들웨어 함수가 호출되는 경로. 경로, 경로패턴 또는 경로와 일치하는 정규식 패턴을 나타내는 문자열이 올 수 있다. 
// callback: 미들웨어 함수 또는 미들웨어 함수의 시리즈/배열
app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, 'public')));

// localhost:8000으로 서버에 접속하면 클라이언트로 index.html을 전송한다.
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
});

// connection 이 수립되면 event handler function의 인자로 socket이 들어온다.
io.on('connection', socket => {
  // console.log(socket.handshake);
  // console.log(socket.nsp);
  // console.log(socket.id);
  // console.log(socket.client.id);

  // 접속한 클라이언트의 정보가 수신되면
  socket.on('login', data => {
    console.log('Client logged-in:\n name:' + data.name + '\n userid: ' + data.userid);

    // socket에 클라이언트 정보를 저장한다
    socket.name = data.name;
    socket.userid = data.userid;

    // 접속된 모든 클라이언트에게 메시지를 전송한다
    io.emit('login', data.name );
  });

  // 클라이언트로부터의 메시지가 수신되면
  socket.on('chat', (data, done) => {
    console.log('Message from %s: %s', socket.name, data.msg);

    let msg = {
      from: {
        name: socket.name,
        userid: socket.userid
      },
      msg: data.msg
    };

    // 메시지를 전송한 클라이언트를 제외한 모든 클라이언트에게 메시지를 전송한다
    // socket.broadcast.emit('chat', msg);

    // 메시지를 전송한 클라이언트에게만 메시지를 전송한다
    // socket.emit('chat', msg);

    // 접속된 모든 클라이언트에게 메시지를 전송한다
    io.emit('chat', msg);

    // 특정 클라이언트에게만 메시지를 전송한다
    // io.to(id).emit('chat', msg);

    // setTimeout(() => {
    //   done();
    // }, 2000);
  });

  // force client disconnect from server
  socket.on('forceDisconnect', ()  => {
    socket.disconnect();
  })

  socket.on('disconnect', () => {
    console.log('user disconnected: ' + socket.name);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

