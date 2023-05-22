/*
    목록에 사용자를 추가하고,
    ID를 기반으로 현재 사용자를 검색하고,
    목록에서 사용자를 제거하고,
    특정 방의 사용자 목록을 가져온다.
*/

const users = [];

// id, username, room 매개변수를 사용하여 새로운 사용자 객체를 생성한다.
// 이 사용자 객체는 users 라는 배열에 추가되고 함수는 새로 만든 사용자 객체를 반환한다.
const userJoin = (id, username, room) => {
    const user = { id, username, room };
    users.push(user);

    return user;
};

// users 배열에서 id가 일치하는 사용자를 검색
// 사용자가 발견되면 반환, 그렇지 않으면 undefined 반환
const getCurrentUser = id => {
    return users.find(user => user.id === id);
};

// users 배열에서 id가 일치하는 사용자를 검색,
// 사용자가 발견되면 배열에서 제거되고 반환, 그렇지 않으면 undefined 반환
const userLeave = id => {
    const index = users.findIndex(user => user.id === id);

    if(index !== -1) {
        return users.splice(index, 1)[0];
    };
};

// 지정된 방에 있는 사용자 배열을 반환, filter() 메서드를 사용하여 room 속성에 따라 배열을 필터링하여 반환
const getRoomUsers = room => {
    return users.filter(user => user.room === room);
};

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
};