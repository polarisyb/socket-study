/**
 * validateMongoDBUri - MongoDB URI의 유효성을 검사합니다. (Validates a MongoDB URI.)
 * @param {string} uri - 유효성 검사할 MongoDB URI.
 * @throws {Error} - MongoDB URI가 잘못된 경우 오류를 발생시킵니다.
 */
const validateMongoDBUri = (uri) => {
  if (!uri || !uri.startsWith('mongodb')) {
    throw new Error('Invalid MongoDB URI specified');
  } else {
    console.log('Valid MongoDB URI specified');
  };
};

module.exports = validateMongoDBUri;