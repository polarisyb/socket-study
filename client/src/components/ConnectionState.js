import React from 'react';

const ConnectionState = ({ isConnected }) => {
  return <p>State: {isConnected ? 'Connected' : 'Disconnected'}</p>;
};

export default ConnectionState;