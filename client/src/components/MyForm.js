import React, { useState } from 'react';
import { socket } from '../socket';

const MyForm = () => {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = event => {
    event.preventDefault();
    setIsLoading(true);

    socket.timeout(1000).emit('sendMessage', value, () => {
      setIsLoading(false);
    });
  };

  return (
    <form onSubmit={ onSubmit }>
      <input onChange={ e => setValue(e.target.value) } />

      <button type="submit" disabled={ isLoading }>Submit</button>
    </form>
  );
};

export default MyForm;