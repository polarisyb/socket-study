const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const path = require('path');
const app = express();
const httpServer = http.createServer(app);
const io = require('socket.io')(httpServer);
const PORT = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, 'public')));

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://polaris:gpffov8d@crud.sogjbgj.mongodb.net/";

// MongoClient 인스턴스를 생성하고, MongoDB 서버에 연결하기 위한 설정을 지정한다.
// MongoClient 생성자는 두 개의 매개변수를 받는다.
// 첫 번째 매개변수는 MongoDB 서버의 연결 문자열('uri')
// 두 번째 매개변수는 연결 설정 객체
const client = new MongoClient(uri, {
  serverApi: {
    // ServerApiVersion.v1을 사용하여 버전 1의 서버 API를 사용하도록 지정
    version: ServerApiVersion.v1,
    // strict 옵션은 엄격한 모드를 활성화하는데 사용.
    // MongoDB 서버의 응답이 예상된 스키마와 일치하는지 확인하고, 일치하지 않으면 오류를 발생시킴
    strict: true,
    // deprecationErros 옵션은 mongoDB  기능이 더 이상 권장되지 않는 경우 오류를 발생시키도록 설정
    // 이를 통해 더 이상 사용되지 않는 기능을 감지하고 업데이트 할 수 있다.
    deprecationErrors: true,
  }
});

// 단일 문서를 컬렉션에 삽입한다. 한 번에 하나의 문서만 삽입할 수 있다.
// const createListing = async (client, newListing) => {
//   const result = await client.db('sample_airbnb').collection('listingAndReviews').insertOne(newListing);

//   console.log(`new listing created with the following id: ${result.insertedId}`);
// };

// 여러 개의 문서를 컬렉션에 삽입한다. 여러 개의 문서를 배열 형태로 전달하여 여러 개의 문서를 삽입할 수 있다.
// const createMultipleListing = async (client, newListings) => {
//   const result = await client.db('sample_airbnb').collection('listingAndReviews').insertMany(newListings);

//   console.log(`${result.insertedCount} new listings created with the following id(s):`);
//   console.log(result.insertedIds);
// };

// listDatabases() - 현재 MongoDB 서버에 있는 모든 데이터베이스 목록을 가져오는 함수
const listDatabases = async client => {
  // db() MongoClient 객체에서 현재 연결된 데이터베이스에 대한 레퍼런스를 가져오는 메서드
  // MongoDB 데이터베이스와 상호작용하는 데 사용된다.
  
  // admin() 데이터베이스 객체('db')에서 관리자 관련 작업을 수행하기 위한 메서드

  // listDatabases() 데이터베이스 관리자 객체('admin') 에서 데이터베이스 목록을 가져오는 메서드
  // 현재 MongoDB 서버에 있는 모든 데이터베이스의 목록을 가져올 수 있다.
  // 배열 형태로 실제 데이터베이스 목록을 담고 있다.
  const databasesList = await client.db().admin().listDatabases();

  console.log('Databases: ');
  databasesList.databases.forEach(db => {
    console.log(`- ${db.name}`);
  });
};

// findOneListingByName() - findOne() 메서드를 호출하여 'name' 필드가 'nameOfListing'과 첫 번째로 일치하는 문서를 검색하여 출력하는 함수
// 주로 단일 문서를 검색하고 반환하는데 쓰인다.
// const findOneListingByName = async (client, nameOfListing) => {
//   const result = await client.db('sample_airbnb').collection('listingAndReviews').findOne( {name:nameOfListing} );

//   if (result) {
//     console.log(`Found a listing in the collection with the name '${nameOfListing}'`);
//     console.log(result);
//   } else {
//     console.log(`No listings found with the name '${nameOfListing}'`);
//   };
// };

// 최소 침실 수와 욕실 수, 가장 최근 리뷰를 기준으로 최대 결과 수를 포함하여 검색 결과를 가져온다.
/* 'cursor' - MongoDB에서 쿼리 결과를 반복적으로 탐색하고 처리하는데 사용되는 객체
            - 데이터를 한 번에 모두 가져오지 않고, 필요한 만큼 데이터를 가져올 수 있다.
            - 결과 집합에서 현재 위치를 나타내는 역할
*/
/*
  toArray() : 'cursor' 의 모든 문서를 배열로 변환한다. 메모리에 모든 문서를 로드하므로, 소량의 결과 집합에 적합하다.
  forEach() : 'cursor' 의 각 문서에 대해 지정된 함수를 실행한다.
  next() : 'cursor' 가 가리키고 있는 문서의 다음 문서를 반환한다.
            처음에 커서를 생성하고 find() 메서드 등을 통해 결과를 가져온 경우, 커서는 첫 번째 문서를 가리킨다.
            그 후 next()를 호출할 때 마다 커서는 다음 문서로 이동한다.
  limit() : 반환할 문서의 수를 제한한다.
  sort() : 문서의 정렬 순서를 지정한다.
  skip() : 결과에서 일부 문서를 건너뛴다.
*/
// const findListingsByCriteria = async (client, { property_type, minBedrooms = 0, minBathrooms = 0, maxResults = Number.MAX_SAFE_INTEGER} ) => {
//   const cursor = client.db('sample_airbnb').collection('listingAndReviews').find({
//     property_type: 'Unknown',
//     bedrooms: { $gte: minBedrooms },
//     bathrooms: { $gte: minBathrooms },
//     // sort() 메서드를 사용하여 검색 결과를 가장 최근 리뷰를 기준으로 내림차순으로 정렬 
//   }).sort({ last_review: -1 })

//   // limit() 메서드를 사용하여 최대 결과 수 제한
//   .limit(maxResults);

//   const results = await cursor.toArray();

//   if (results.length > 0) {
//     console.log(`Found listing(s) with at least ${minBedrooms} bedrooms and ${minBathrooms} bathrooms: `);
//     console.log(results);
//     console.log( `Found ${results.length} listing(s)`);
//   } else {
//     console.log(`No listings found with at least ${minBedrooms} bedrooms and ${minBathrooms} bathrooms.`);
//   };
// };

// updateListingByName - updateOne() 메서드를 사용하여 해당 문서를 찾고 '$set' 연산자를 사용하여 업데이트 내용을 지정한다.
// 'matchedCount'는 쿼리 조건과 일치하는 문서의 수를, 'modifiedCount'는 실제로 업데이트 된 문서의 수를 나타낸다.
// const updateListingByName = async (client, nameOfListing, updateListing) => {
//   const result = await client.db('sample_airbnb').collection('listingAndReviews')
//   .updateOne({ name: nameOfListing }, { $set: updateListing }, { $set: { property_type: 'Unknown' } });

//   console.log(`${result.matchedCount} document(s) matched the query criteeria`);
//   console.log(`${result.modifiedCount} document(s) was/were updated`);
// };

// upsertListingByName - 지정된 이름의 문서를 업데이트하거나 존재하지 않는 경우 새로운 문서로 삽입한다.
// 'upsert: true' 옵션을 사용하여 새로운 문서를 삽입할 수 있도록 설정한다.
// const upsertListingByName = async (client, nameOfListing, updateListing) => {
//   const result = await client.db('sample_airbnb').collection('listingAndReviews')
//   .updateOne({ name: nameOfListing }, { $set: updateListing }, { upsert: true} );

//   console.log(`${result.matchedCount} document(s) matched the query criteeria`)

//   if (result.upsertedCount > 0) {
//     console.log(`One document was inserted with the id ${result.upsertedId}`);
//   } else {
//     console.log(`${result.modifiedCount} document(s) was/were updated`);
//   }
// };

// updateAllListingsPropsType - updateMany() 메서드를 사용하여 특정 필드가 존재, 존재하지 않는 문서를 찾고 '$set' 연산자를 사용하여
// 해당 문서의 property_type 을 지정한 값으로 설정한다.
// 첫 번째 인자로 지정한 쿼리 조건은 문서가 만족해야 하는 조건을 나타낸다.
// 두 번째 인자로 지정한 업데이트 연산자는 해당 조건을 만족하는 문서들에게 적용된다.
const updateAllListingsPropsType = async (client) => {
  const result = await client.db('sample_airbnb').collection('listingAndReviews')
  .updateMany({ property_type: { $exists: true }, monami: { $exists: true }, card: { $exists: true }  },
    { $set: { property_type: 'Hello Props!', monami: 'Ball pen', card: 'ShinHan, NH' } });

    console.log(`${result.matchedCount} document(s) matched the query criteria`);
    console.log(`${result.modifiedCount} document(s) was/were updated`);
};

const run = async () => {
  try {

    await client.connect();

    await client.db('admin').command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    // const db = client.db("sample_airbnb");
    // const coll = db.collection("listingAndReviews");

    // await coll.createIndex({ name: 1 }, { unique: true });
    // const options = { ordered: false };

    // insertOne();
    // await createListing(client, {
    //   name: 'Tom House',
    //   memo: 'Ah..Jerry?',
    //   propert_type: 'House',
    //   bedrooms: 2,
    //   bathrooms: 1
    // });
    // const insertOneResult = await coll.insertOne(createListing, options);
    // console.log(insertOneResult.insertedId);

    // insertMany();
    // await createMultipleListing(client, [
    //   {
    //     name: 'Infinite Views',
    //     memo: 'Really? Infinity?',
    //     property_type: 'House',
    //     bedrooms: 5,
    //     bathrooms: 4.5,
    //     beds: 5
    //   },
    //   {
    //     name: 'Private room in Space',
    //     memo: 'Space? what??',
    //     property_type: 'Space',
    //     bedrooms: 1,
    //     bathrooms: 1
    //   },
    //   {
    //     name: 'Beautiful Beach House',
    //     memo: 'Enjoy',
    //     bedrooms: 4,
    //     bathrooms: 2.5,
    //     beds: 7,
    //     last_review: new Date()
    //   },
    // ]);
    // const insertManyResult = await coll.insertMany(createMultipleListing, options);
    // console.log(insertManyResult.insertedIds);

    await listDatabases(client);

    // await findOneListingByName(client, 'Infinite Views');

    // await findListingsByCriteria(client, {
    //   property_type: 'Unknown',
    //   minBedrooms: 1,
    //   minBathrooms: 1,
    //   maxResults: 7
    // });

    // await updateListingByName(client, 'Tom Clancy', { bedrooms: 2, property_type: 'Steam', beds: 2, property_type: 'Unknown' });

    // await upsertListingByName(client, 'Rainbow Six Siege', { name: 'Tom Clancy', memo: 'Game', bedrooms: 1, bathrooms: 2 });

    await updateAllListingsPropsType(client);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    
    await client.close();
    console.log("Disconnected from MongoDB");
    
  }
}
run().catch(console.dir);

httpServer.listen(PORT, err => {
  if (err) throw err;
  console.log(`Server running on port ${PORT}`);
});

// io.on('connection', socket => {

//   console.log(`User Connected: ${socket.id}`);

//   socket.onAny( event => {
//     console.log(`Socket Event: ${event}`);
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });