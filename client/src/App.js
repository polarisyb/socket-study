import './App.css';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';

const socket = io.connect('http://localhost:8000');

const App = () => {
  const [room, setRoom] = useState('');

  const [message, setMessage] = useState('');
  const [messageReceived, setMessageReceived] = useState('');
  
  const joinRoom = () => {
    if (room !== '') {
      socket.emit('joinRoom', room);
    };
  };
  
  const sendMessage = () => {
    socket.emit('sendMessage', { message, room });
  };

  useEffect(() => {
    socket.on('receiveMessage', data => {
      setMessageReceived(data.message);
    });
  }, []);

  return (
    <div className='App'>
      <input placeholder='Room Number' onChange={ e => {
        setRoom(e.target.value);
      }} />
      <button onClick={joinRoom}>Join Room</button>
      <input placeholder='Message..' onChange={ e => {
        setMessage(e.target.value);
      }} />
      <button onClick={sendMessage}>Send Message</button>
      <h1>Message:</h1>
      {messageReceived}
    </div>
  );
};

export default App;
