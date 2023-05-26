const validateMongoDBUri = (uri) => {
  if (!uri || !uri.startsWith('mongodb')) {
    throw new Error('Invalid MongoDB URI specified');
  } else {
    console.log('Valid MongoDB URI specified');
  };
};

module.exports = validateMongoDBUri;