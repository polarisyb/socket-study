/**
 * listDatabases - MongoDB 서버의 데이터베이스 목록을 검색합니다 (Retrieves a list of databases on the MongoDB server.)
 * @param {object} client - The MongoDB client.
 * db() MongoClient 객체에서 현재 연결된 데이터베이스에 대한 레퍼런스를 가져오는 메서드
 * MongoDB 데이터베이스와 상호작용하는 데 사용된다.
 * admin() 데이터베이스 객체('db')에서 관리자 관련 작업을 수행하기 위한 메서드
 * listDatabases() 데이터베이스 관리자 객체('admin') 에서 데이터베이스 목록을 가져오는 메서드
 * 현재 MongoDB 서버에 있는 모든 데이터베이스의 목록을 가져올 수 있다.
 * 배열 형태로 실제 데이터베이스 목록을 담고 있다.
 */
const listDatabases = async client => {
  const databasesList = await client.db().admin().listDatabases();

  console.log('Databases: ');
  databasesList.databases.forEach(db => {
    console.log(`- ${db.name}`);
  });
};

module.exports = listDatabases;