import React, { useState } from 'react';
import { socket } from '../socket';

const JoinRoom = () => {
  
  const [room, setRoom] = useState('');
  
  const Join = () => {
    if (room !== '') {
      socket.emit('joinRoom', room);
    };
  };

  return(
    <>
      <input
        placeholder="Room Number..."
        onChange={(event) => {
          setRoom(event.target.value);
        }}
      />
      <button onClick={Join}>Join Room</button>
    </>
  );
};

export default JoinRoom;