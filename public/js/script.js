/*
  웹 소켓을 사용하여 서버와 통신하면서, 소켓을 통해 전달되는 데이터에 따라 자동차의 이동과 회전을 처리하는 역할
*/

document.addEventListener('DOMContentLoaded', () => {
  const socket = io();
  const car = document.querySelector('.car');

  // 자동차가 한 번에 이동할 거리를 지정
  let moveBy = 10;
  
  // 자동차의 회전 각도
  let deg = 0;

  socket.on('move', data => {
    // 이동과 회전을 처리할 때 현재 자동차의 위치를 가져오기 위해 'getComputedStyle' 함수를 사용
    // 이 함수는 자동차 요소의 현재 스타일 정보를 가져온다.
    // 그리고 각각의 경우에 따라 'style' 속성을 업데이트 하여 자동차를 이동시키거나 회전시킨다.
    const carStyle = getComputedStyle(car);
    
    // 자동차를 이동시키는 경우, 'parseInt' 함수를 사용하여 현재 위치 값을 정수로 변환한 수
    // 'moveBy' 값을 더하거나 빼서 새로운 위치 값을 설정
    
    // 마찬가지로 회전시에는 'deg' 변수를 적절히 조정한 후 'car.style.transform' 속성을 업데이트하여 회전 효과 적용
    const currentLeft = parseInt(carStyle.left);
    const currentTop = parseInt(carStyle.top);

    switch (data) {
      case 'left':
        car.style.left = currentLeft - moveBy + 'px';
        break;
      case 'right':
        car.style.left = currentLeft + moveBy + 'px';
        break;
      case 'top':
        car.style.top = currentTop - moveBy + 'px';
        break;
      case 'bottom':
        car.style.top = currentTop + moveBy + 'px';
        break;
      case 'rLeft':
        deg -= 5;
        car.style.transform = 'rotate(' + deg + 'deg)';
        break;
      case 'rRight':
        deg += 5;
        car.style.transform = 'rotate(' + deg + 'deg)';
        break;
    };

  });

});
