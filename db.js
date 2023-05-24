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
    const db = client.db("test");
    const coll = db.collection("testtest");

    const docs = [
      {name: "Halley's Comet", officialName: "1P/Halley", orbitalPeriod: 75, radius: 3.4175, mass: 2.2e14},
      {name: "Wild2", officialName: "81P/Wild", orbitalPeriod: 6.41, radius: 1.5534, mass: 2.3e13},
      {name: "Comet Hyakutake", officialName: "C/1996 B2", orbitalPeriod: 17000, radius: 0.77671, mass: 8.8e12},
      {name: "Ct Hyakutake", officialName: "C/196 B2", orbitalPeriod: 1000, radius: 0.7771, mass: 8.8e2},
      {name: "Comet Hyaake", officialName: "C/199 B2", orbitalPeriod: 1700, radius: 0.7671, mass: 8.e2},
    ];

    // planets 컬렉션에 name 필드에 대한 Unique Index를 생성, name 필드는 고유한 값을 가지게 된다.
    await coll.createIndex({ name: 1 }, { unique: true });

    // inserMany 메서드에 전달할 옵션을 설정.
    // ordered: false 중복 데이터가 발견되어도 오류를 발생시키지 않고 나머지 문서를 계속 삽입하도록 설정
    // 이를 통해 중복된 데이터가 있는 경우에도 오류가 발생하지 않고 나머지 문서가 삽입된다.
    const options = { ordered: false };

    // 위에서 생성한 컬렉션에 'docs' 배열에 있는 문서들을 'insertMany' 메서드를 사용하여 삽입
    // options 옵션을 함께 전달하여 중복 데이터가 발견되어도 오류를 발생시키지 않고 나머지 문서를 삽입
    // result 에는 삽입된 문서들의 정보가 담긴 객체가 반환된다.
    const result = await coll.insertMany(docs, options);

    // 삽입된 문서들의 '_id' 값을 출력
    // result.insertedIds 는 삽입된 각 문서의 '_id'값을 가진 객체
    // 이를 통해 어떤 문서들이 성공적으로 삽입되었는지 확인 가능
    console.log(result.insertedIds);

    // find() 메서드를 사용하여 컬렉션에서 모든 문서를 검색
    // const cursor = coll.find();

    // await cursor.forEach((document) => {
    //   console.log(document);
    // });

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
