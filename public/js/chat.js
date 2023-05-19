document.addEventListener("DOMContentLoaded", () => {
  // 소켓 서버에 연결한다
  let socket = io();

  // 알파벳 소문자로 이루어진 세 글자의 임의의 이름을 생성하여 반환하는 함수
  const makeRandomName = () => {
    let name = "";
    let possible = "abcdefghijklmnopqrstuvwxyz";
    for (let i = 0; i < 3; i++) {
      name += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return name;
  };

  // 서버로 자신의 정보를 전송한다.
  socket.emit("login", {
    name: makeRandomName(),
    userid: "polaris@acrosspace.com"
  });

  // 서버로부터의 메시지가 수신되면
  socket.on("login", data => {
    let chatLogs = document.getElementById("chatLogs");
    let newMessage = document.createElement("div");
    newMessage.innerHTML = "<strong>" + data + "</strong> has joined";
    chatLogs.appendChild(newMessage);
  });

  // 서버로부터의 메시지가 수신되면
  socket.on("chat", data => {
    let chatLogs = document.getElementById("chatLogs");
    let newMessage = document.createElement("div");
    newMessage.innerHTML = data.msg + " : from <strong>" + data.from.name + "</strong>";
    chatLogs.appendChild(newMessage);
  });

  // 폼 제출 이벤트 핸들러
  let form = document.querySelector("form");
  form.addEventListener("submit", e => {
    e.preventDefault();
    let msgForm = document.getElementById("msgForm");

    // 서버로 메시지를 전송한다.
    socket.emit("chat", { msg: msgForm.value }, () => {
      // console.log('서버로 메시지를 전송했습니다');
    });
    msgForm.value = "";
  });
  
});
