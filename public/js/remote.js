/*
  웹 소켓을 사용하여 서버와 통신하면서, 버튼 클릭 이벤트를 감지하고, 해당 이벤트에 대한 처리를 하는 remote 클라이언트 소스
*/

// 'DOMContentLoaded' 이벤트는 문서가 로드되면 실행되는 함수
document.addEventListener('DOMContentLoaded', () => {
  const socket = io.connect();
  let top = false;
  let left = false;
  let right = false;
  let bottom = false;
  let rotateLeft = false;
  let rotateRight = false;

  let topButton  = document.getElementById('top');
  let leftButton  = document.getElementById('left');
  let rightButton  = document.getElementById('right');
  let bottomButton  = document.getElementById('bottom');
  let rotateLeftButton  = document.getElementById('rotateLeft');
  let rotateRightButton  = document.getElementById('rotateRight');

  topButton.onmousedown = e =>{ top = true; };
  topButton.onmouseup = e =>{ top = false; };

  leftButton.onmousedown = e =>{ left = true; };
  leftButton.onmouseup = e =>{ left = false; };

  rightButton.onmousedown = e =>{ right = true; };
  rightButton.onmouseup = e =>{ right = false; };

  bottomButton.onmousedown = e =>{ bottom = true; };
  bottomButton.onmouseup = e =>{ bottom = false; };

  rotateLeftButton.onmousedown = e =>{ rotateLeft = true; };
  rotateLeftButton.onmouseup = e =>{ rotateLeft = false; };

  rotateRightButton.onmousedown = e =>{ rotateRight = true; };
  rotateRightButton.onmouseup = e =>{ rotateRight = false; };

  const mainLoop = () => {
    if ( top ) {
      socket.emit('move', 'top');
    };
    if ( left ) {
      socket.emit('move', 'left');
    };
    if ( right ) {
      socket.emit('move', 'right');
    };
    if ( bottom ) {
      socket.emit('move', 'bottom');
    };
    if ( rotateLeft ) {
      socket.emit('move', 'rLeft');
    };
    if ( rotateRight ) {
      socket.emit('move', 'rRight');
    };
    // setTimeout 함수를 사용하여 25ms 간격으로 호출
    // 현재 설정된 변수를 확인하고 해당 변수가 'true' 인 경우, 서버로 해당 이벤트에 대한 데이터를 전달
    // 이를 통해 버튼을 클릭하면 해당 방향으로 이동하거나 회전하는 등의 이벤트를 서버로 전송이 가능하다.
    setTimeout(mainLoop, 25);
  };
  
  mainLoop();

});