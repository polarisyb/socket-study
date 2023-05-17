const socket = io();

const crazyButton = document.getElementById('crazyButton');
const startButton = document.getElementById('startButton');
const startingSection = document.querySelector('.starting-section');
const homeBtn = document.querySelector('.home-btn');

// Start 버튼을 숨기는 함수
const hideStartButton = () => {
  startButton.style.display = 'none';
  crazyButton.style.display = 'block';
  startingSection.style.display = 'none';
};

// Start 버튼을 보이게 하는 함수
const showStartButton = () => {
  startButton.style.display = 'block';
  crazyButton.style.display = 'none';
  startingSection.style.display = 'block';
};

// crazyButton 개체의 top, left, animation 스타일을 담은 함수 
const goCrazy = (offLeft, offTop) => {
  let top, left;

  left = offLeft;
  top = offTop;

  crazyButton.style.top = top + 'px';
  crazyButton.style.left = left + 'px';
  crazyButton.style.animation = "none";
};

// startButton 클릭시 startGame 이벤트를 전달하고  hideStartButton 함수를 작동
startButton.addEventListener('click' , () => {
  // 송신자에게만 이벤트를 전달
  socket.emit('startGame');
  hideStartButton();
});

// homeBtn 클릭시 home 이벤트를 전달하고 showStartButton 함수를 작동
homeBtn.addEventListener('click', () => {
  // 송신자에게만 이벤트를 전달
  socket.emit('home');
  showStartButton();
});

// crazyButton 클릭시 crazyIsClicked 이벤트를 전달하고 data로 offsetLeft, offsetTop 을 전달
crazyButton.addEventListener('click', () => {
  // 송신자에게만 이벤트를 전달
  socket.emit('crazyIsClicked', {
    offsetLeft: Math.random() * ((window.innerWidth - crazyButton.clientWidth) - 200),
    offsetTop: Math.random() * ((window.innerHeight - crazyButton.clientHeight) - 100)
  });
});

// index.js 에서 crazyIsClicked 이벤트를 전달받고 data로 전달받은 offsetLeft, offsetTop 값으로 개체의 x축 좌표 값과 y축 좌표 값을 설정
socket.on('crazyIsClicked', data => {
  goCrazy(data.offsetLeft, data.offsetTop);
  console.log(data);
});

// // index.js 에서 Game start! 이벤트를 전달받고 hideStartButton 함수를 실행
// socket.on('Game start!', () => {
//   hideStartButton();
// });

// // // index.js 에서 Game over! 이벤트를 전달받고 showStartButton 함수를 실행
// socket.on('Game over!', () => {
//   showStartButton();
// });
