import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object

// process.env.NODE_ENV 환경 변수를 확인하여 현재 실행 환경이 'production' 인지 확인하고,
// 그렇지 않은 경우 'http://localhost:8000'을 URL로 사용
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:8000';

export const socket = io(URL);