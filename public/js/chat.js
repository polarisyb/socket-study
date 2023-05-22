const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const socket = io();

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
  <p class="meta">
  ${message.username}
  <span>
  ${month}월 ${date}일 ${week[day]}요일 ${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes }`  : minutes }
  </span>
  </p>
  <p class="text">
  ${message.text}
  </p>
  `;
  document.querySelector('.chat-messages').appendChild(div);
};

// chat 사이드에 room 이름 출력
const outputRoomName = room => {
  roomName.innerText = room;
};

// chat 사이드에 room에 입장한 user 출력
const outputUsers = users => {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
};

socket.emit('joinRoom', { username, room });

socket.on('roomUsers', ({ room, users}) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.on('message', message => {
  console.log(message);
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

/*
  양식 전송 이벤트를 캡처
  페이지가 다시 로드되지 않도록 설정
  입력 필드에서 메시지 텍스트를 검색, 공백 제거, 비어있는 지 확인
  메세지 데이터와 함께 서버에 이벤트를 보냄
  입력필드를 지우고 편의를 위해 포커스를 다시 입력 필드로 설정
*/
chatForm.addEventListener('submit', e => {
  // 폼이 제출되었을 때 페이지가 다시 로드 되지 않고 js 코드에서 추가적인 작업 수행
  e.preventDefault();

  // message text를 가져온다
  // e.target은 이벤트가 발생한 요소 'chatFrom' 요소를 참조
  // elements 속성을 통해 폼 요소에 접근
  // msg는 name 속성이 msg 인 폼 요소의 값을 가져옴
  let msg = e.target.elements.msg.value;
  // console.log(msg);

  // 선행 또는 후행 공백을 제거, 메세지 텍스트에 공백 문자가 포함되지 않는다.
  // msg = msg.trim();

  // if (!msg) {
  //   console.log(false);
  //   return false;
  // }

  // 서버로 chatMessage 이벤트와 함께 msg 데이터를 송신한다.
  socket.emit('chatMessage', msg);

  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();

});


document.getElementById('leave-btn').addEventListener('click', err => {
  const leaveRoom = confirm('정말 채팅방을 나가시겠습니까?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
    throw err;
  };
});