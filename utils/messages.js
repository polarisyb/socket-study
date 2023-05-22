/*
    username - 사용자
    text - 메세지 내용
    time - 현재 시간
*/

const moment = require('moment');

const formatMessage = (username, text) => {
    return {
        username,
        text,
        time: moment().format('h:mm') 
    };
};

module.exports = formatMessage;