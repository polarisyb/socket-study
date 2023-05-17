

  


const socket = io();

const startingSection = document.querySelector('.starting-section');
const crazyButton = document.getElementById('crazyButton');
const startButton = document.getElementById('startButton');
const homeBtn = document.querySelector('.home-btn');

const hideStartButton = () => {
  startButton.style.display = 'none';
  crazyButton.style.display = 'block';
  startingSection.style.display = 'none';
};

const showStartButton = () => {
  startButton.style.display = 'block';
  crazyButton.style.display = 'none';
  startingSection.style.display = 'block';
};

const goCrazy = (offLeft, offTop) => {
  let top, left;

  left = offLeft;
  top = offTop;

  crazyButton.style.top = top + 'px';
  crazyButton.style.left = left + 'px';
  crazyButton.style.animation = "none";
};

startButton.addEventListener('click' , () => {
  socket.emit('startGame');
  hideStartButton();
});

homeBtn.addEventListener('click', () => {
  socket.emit('home');
  showStartButton();
});

crazyButton.addEventListener('click', () => {
  socket.emit('crazyIsClicked', {
    offsetLeft: Math.random() * ((window.innerWidth - crazyButton.clientWidth) - 100),
    offsetTop: Math.random() * ((window.innerHeight - crazyButton.clientHeight) - 50)
  });
});

socket.on('crazyIsClicked', data => {
  goCrazy(data.offsetLeft, data.offsetTop);
});