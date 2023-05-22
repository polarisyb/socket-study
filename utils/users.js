/*
    목록에 사용자를 추가하고,
    ID를 기반으로 현재 사용자를 검색하고,
    목록에서 사용자를 제거하고,
    특정 방의 사용자 목록을 가져온다.
*/

const users = [];

// id, username, room 매개변수를 사용하여 새로운 사용자 객체를 생성한다.
// 이 사용자 객체는 'users' 라는 배열에 추가되고 함수는 새로 만든 사용자 객체를 반환한다.
const userJoin = (id, username, room) => {
    const user = { id, username, room };
    users.push(user);
    // console.log(user.id);

    return user;
};

// 'users' 배열에서 id가 일치하는 사용자를 'users' 배열에서 찾아서 해당 사용자를 반환
// 일치하는 사용자가 없으면 'undefined'를 반환
const getCurrentUser = id => {
    return users.find(user => user.id === id);
};

// 'users' 배열에서 id가 일치하는 사용자를 'users' 배열에서 찾아서 제거하고, 해당 사용자를 반환
// 일치하는 사용자가 없으면 'undefined' 를 반환
const userLeave = id => {
    const index = users.findIndex(user => user.id === id);

    if(index !== -1) {
        return users.splice(index, 1)[0];
    };
};

// 'users' 배열을 순회하면서 각 사용자의 'room' 값과 인자로 전달된 'room 값이 일치하는 지 확인하고 배열로 반환
const getRoomUsers = room => {
    // filter() 'user'를 매개변수로 받고 해당 'user'의 'room' 값과 전달된 'room' 값이 일치하는 지 확인하여
    // 'true' or 'false'를 반환. 
    // 'true'를 반환하는 경우 해당 'user' 는 결과 배열에 포함되고,
    // 'flase' 를 반환하는 경우 해당 'user' 는 결과 배열에서 제외된다.
    return users.filter(user => user.room === room);
};

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};