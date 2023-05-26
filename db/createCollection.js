const createCollection = async (db, collectionName) => {
  try {
    const collections = await db.collections();
    const collectionExists = collections.some(coll => coll.collectionName === collectionName);

    if (!collectionExists) {
      await db.createCollection(collectionName);
      console.log(`Created collection '${collectionName}' in database.`);
    } else {
      console.log(`Collection '${collectionName}' already exists in database.`);
    };
  } catch (err) {
    console.error('Error:', err);
  };
};

module.exports = createCollection;
