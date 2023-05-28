/**
 * createCollection - 지정된 데이터베이스에 컬렉션이 없는 경우 해당 컬렉션을 생성합니다. (Creates a collection in the specified database if it doesn't already exist.)
 * @param {object} db - MongoDB 데이터베이스 객체
 * @param {string} collectionName - 생성할 컬렉션의 이름
 * @throws {Error} - 컬렉션을 생성하는데 문제가 있을 경우 오류를 발생시킵니다
 */
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
