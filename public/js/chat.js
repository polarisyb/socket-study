const socket = io();

const chatForm = document.getElementById('chat-form');


const outputMessage = () => {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `

  `;
};

socket.on('message', message => {
  console.log(message);
  outputMessage(message);
});



chatForm.addEventListener('submit', e => {
  // 폼이 제출되었을 때 페이지가 다시 로드 되지 않고 js 코드에서 추가적인 작업 수행
  e.preventDefault();

  // message text를 가져온다
  // e.target은 이벤트가 발생한 요소 'chatFrom' 요소를 참조
  // elements 속성을 통해 폼 요소에 접근
  // msg는 name 속성이 msg 인 폼 요소의 값을 가져옴
  const msg = e.target.elements.msg.value;
  // console.log(msg);

  // 서버로 chatMessage 이벤트와 함께 msg 데이터를 송신한다.
  socket.emit('chatMessage', msg);
});


document.getElementById('leave-btn').addEventListener('click', err => {
  const leaveRoom = confirm('정말 채팅방을 나가시겠습니까?');
  if (leaveRoom) {
    window.location = '/index.html';
  } else {
    throw err;
  };
});