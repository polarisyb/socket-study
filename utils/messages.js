/*
    username - 사용자
    text - 메세지 내용
    time - 현재 시간
*/

const formatMessage = (username, text, time) => {
    return {
        username,
        text,
        time
    };
};

module.exports = formatMessage;