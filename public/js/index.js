import { initializeSocket, socketId } from './socket.js';

const documentList = document.getElementById('documentList');
const idList = document.getElementById('idList');

initializeSocket(documentList);
socketId(idList);