/**
 * validateMongoDBUri - Validates a MongoDB URI.
 * @param {string} uri - The MongoDB URI to validate.
 * @throws {Error} - Throws an error if the MongoDB URI is invalid.
 */
const validateMongoDBUri = (uri) => {
  if (!uri || !uri.startsWith('mongodb')) {
    throw new Error('Invalid MongoDB URI specified');
  } else {
    console.log('Valid MongoDB URI specified');
  };
};

module.exports = validateMongoDBUri;