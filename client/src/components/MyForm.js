import React, { useState } from 'react';
import { socket } from '../socket';

const MyForm = () => {
  // value, isLoading 두 개의 상태를 useState 훅을 통해 정의
  // value는 입력 필드의 값, isLoading은 폼이 제출되는 동안의 로딩 상태
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /*
    폼이 제출되면 onSubmit 함수가 호출되고, 이벤트의 기본 동작을 중지시킨다.
    disabled 의 상태를 true로 설정되어 버튼이 비활성화 된다.
    이는 사용자가 버튼을 여러 번 클릭하지 못하도록 방지하고, 요청이 처리되는 동안 로딩 상태를 나타내는 시각적 피드백을 제공한다.
  */
  const onSubmit = event => {
    event.preventDefault();
    setIsLoading(true);

    socket.timeout(1000).emit('sendMessage', value, () => {
      setIsLoading(false);
    });
  };

  return (
    <form onSubmit={ onSubmit }>
      <input type="text" placeholder='message..' onChange={ e => setValue(e.target.value) } />

      <button type="submit" disabled={ isLoading }>Submit</button>
    </form>
  );
};

export default MyForm;