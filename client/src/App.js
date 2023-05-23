import React, { useState, useEffect } from 'react';
import { socket } from './socket';
import MyForm from './components/MyForm';
import Events from './components/Events';
import ConnectionManager from './components/ConnectionManager';
import ConnectionState from './components/ConnectionState';
import JoinRoom from './components/JoinRoom';


const App = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [fooEvents, setFooEvents] = useState([]);

  // 함수형 컴포넌트에서 부수 효과(side effects)를 수행
  /* 부수 효과 - 컴포넌트 외부의 상태를 변경하거나 네트워크 요청을 보내는 등의 작업 */
  // useEffect는 컴포넌트가 렌더링 될 때마다 실행되며, 의존성 배열을 통해 특정 상태나 프로퍼티가 변경될 때에만 실행되도록 설정할 수 있다.

  /* 이전 코드 개선 사항 */
  // onConnect, onDisconnect, onFooEvent, sendMessage 함수들을 useEffect 바깥에 정의
  // 매 렌더링마다 새로운 함수 인스턴스를 생성하는 것을 방지
  const onConnect = () => {
    setIsConnected(true);
  }

  const onDisconnect = () => {
    setIsConnected(false);
  }

  const onFooEvent = value => {
    setFooEvents(previous => [...previous, value]);
  }

  const sendMessage = value => {
    console.log(value);
  };

  const message = msg => {
    console.log(msg);
  };

  const joinMessage = msg => {
    console.log(msg);
  };

  useEffect(() => {
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('foo', onFooEvent);
    socket.on('sendMessage', sendMessage);
    socket.on('message', message);
    socket.on('joinMessage', joinMessage);

    return () => {
      // socket.off 이벤트 리스너 해제
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('foo', onFooEvent);
      socket.off('sendMessage', sendMessage);
      socket.off('message', message);
      socket.off('joinMessage', joinMessage);

    };
    // 의존성 배열이 비어있다면 ([]), useEffect의 첫번째 인자로 전달된 함수는 컴포넌트가 처음 마운트 될 때만 실행된다.
  }, []);

  return (
    <div className="App">
      <ConnectionState isConnected={ isConnected } />
      <JoinRoom />
      <Events events={ fooEvents } />
      <ConnectionManager />
      <MyForm />
    </div>
  );
};

export default App;