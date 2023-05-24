// mongodb 패키지에서 MongoClient를 가져온다.
// 이를 통해 MongoDB에 연결할 수 있다.
const { MongoClient } = require("mongodb");

// MongoDB 서버의 연결 문자열을 변수에 할당.
const uri =
  "mongodb://127.0.0.1:27017";

// mongoDB 클라이언트 객체를 할당하기 위해 생성된 변수.
// 연결 및 데이터베이스 작업을 수행하기 위해서는 클라이언트 객체가 필요.
const client = new MongoClient(uri);

const run = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    // 데이터베이스 및 컬렉션을 가져온다.
    const db = client.db("sample_guides");
    const coll = db.collection("planets");

    // find() 메서드를 사용하여 컬렉션의 모든 문서를 검색 ('planets)
    const cursor = coll.find();

    // cursor.forEach() 비동기적인 메서드, MongoDB의 문서를 처리하기 위해 사용
    // 동기적, 배열의 각 요소 처리를 위한 javascript Array.prototype.forEach()와는 차이가 있다.
    await cursor.forEach(console.log);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    // 완료/오류 시 클라이언트 객체 연결이 닫히도록 함.
    await client.close();
    console.log("Disconnected from MongoDB");
  };
};

// 함수를 호출하고 에러가 발생하면 콘솔에 출력
run().catch(console.dir);
