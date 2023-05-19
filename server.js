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
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'), err => {
    if (err) throw err;
  });
});

app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat.html'), err => {
    if (err) throw err;
  });
});

// connection 이 수립되면 event handler function의 인자로 socket이 들어온다.
io.on('connection', socket => {
  socket.emit('message', 'Welcome to Chat-app!');

  socket.broadcast.emit('message', 'A user has joined the chat');
  
  socket.on('chatMessage', msg => {
    io.emit('message', msg);
  });

  socket.onAny( e => {
    console.log(`Socket Event: ${e}`);
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('message', 'A user has left the chat');
  });
});

server.listen(PORT, (err) => { 
  if (err) throw err;
  console.log(`Server running on port ${PORT}`);
});

