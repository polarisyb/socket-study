const socket = io();

const initializeSocket = documentList => {
  
  socket.on('document', data => {
    data.forEach(item => {
      const listItem = document.createElement('li');
      listItem.innerText = JSON.stringify(item);
      console.log(item);
      const keysArray = Object.keys(item);
      const valuesArray = Object.values(item);
      documentList.appendChild(listItem);
      console.log(keysArray);
      console.log(valuesArray);
    });
  });
};

const socketId = idList => {
  
  socket.on('message', data => {
    const listData = document.createElement('li');
    listData.innerText = data;
    idList.appendChild(listData);
    console.log(data);
  });
};

export { initializeSocket, socketId };
