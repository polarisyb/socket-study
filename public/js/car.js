let car = document.querySelector('.car');
let moveBy = 10;

// 창의 너비와 높이를 2로 나눈 후 소수 점 이하를 버린 값을 할당.
// 이를 통해 창의 중앙 좌표를 계산.
// 
let midx = Math.floor(window.innerWidth / 2);
let midy = Math.floor(window.innerHeight / 2);

// 페이지가 완전히 로드 된 후 실행
window.addEventListener('load', () => {
  // car 요소의 css position 속성을 absolute로 설정.
  // absolute 값은 요소를 다른 요소들과 겹치지 않고 독립적으로 위치할 수 있도록 함.
  // car 요소의 left와 top css 속성을 0 으로 초기화.
  // car 요소의 모서리가 문서의 좌상단 모서리에 정확히 위치하게 된다.
  car.style.position = 'absolute';
  car.style.left = 0;
  car.style.top = 0;
  car.style.left = parseInt(car.style.left) + midx + 'px';
  car.style.top = parseInt(car.style.top) + midy + 'px';
  myGameArea.start();
});


// 캔버스를 생성하고 캔버스의 크기를 창의 크기로 설정한 뒤, 문서에 캔버스를 삽입한다.
let myGameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    // 여기에서 this 는 'start' 메서드를 호출한 객체, 'myGameArea' 가 된다.
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.id="demo";
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
  }
}
