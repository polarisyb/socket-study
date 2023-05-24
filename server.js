const express = require('express');
const http = require('http');
const app = express();
const httpServer = http.createServer(app);
const io = require('socket.io')(httpServer);
const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static('public'));

io.on('connection', socket => {
  socket.onAny( event => {
    console.log(`Socket Event: ${event}`);
  });

  console.log(`User Connected: ${socket.id}`);

  socket.on('sendMessage', value => {
    console.log(`${socket.id} send to message : ${value}`);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

httpServer.listen(PORT, err => {
  if (err) throw err;
  console.log(`Server running on port ${PORT}`);
});
