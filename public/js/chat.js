const socket = io();

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');


const outputMessage = message => {
  let now = new Date();  // 현재시간
  let month = (now.getMonth() + 1);  // 월 
  let date = now.getDate(); // 일
  let day = now.getDay();  // 요일
  let week = ['일', '월', '화', '수', '목', '금', '토'];
  let hours = now.getHours();
  let minutes = now.getMinutes();

  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `
    <p class="meta">Brad
      <span>
        ${month}월 ${date}일 ${week[day]}요일 ${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes }`  : minutes }
      </span>
    </p>
    <p class="text">
      ${message}
    </p>
  `;
  document.querySelector('.chat-messages').appendChild(div);
};

socket.on('message', message => {
  // console.log(message);
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
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