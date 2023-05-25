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

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const run = async () => {
  try {

    await client.connect();

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const db = client.db("test");
    const coll = db.collection("test");
    
    /* Create ( 중복 요소 제외, 중복 되지 않은 요소는 추가, 삽입된 문서들의 _id 값 출력) */
    const docs = [
      {name: "Halley's Comet", officialName: "1P/Halley", orbitalPeriod: 75, radius: 3.4175, mass: 2.2e14},
      {name: "Wild2", officialName: "81P/Wild", orbitalPeriod: 6.41, radius: 1.5534, mass: 2.3e13},
      {name: "Comet Hyakutake", officialName: "C/1996 B2", orbitalPeriod: 17000, radius: 0.77671, mass: 8.8e12},
      {name: "Ct Hyakutake", officialName: "C/196 B2", orbitalPeriod: 1000, radius: 0.7771, mass: 8.8e2},
      {name: "Comet Hyaake", officialName: "C/199 B2", orbitalPeriod: 1700, radius: 0.7671, mass: 8.e2},
      {name: "george", officialName: "C23/199 B2", orbitalPeriod: 12700, radius: 0.57671, mass: 4.e2},
    ];
    
    // planets 컬렉션에 name 필드에 대한 Unique Index를 생성, name 필드는 고유한 값을 가지게 된다.
    // await coll.createIndex({ name: 1 }, { unique: true });

    // // inserMany 메서드에 전달할 옵션을 설정.
    // // ordered: false 중복 데이터가 발견되어도 오류를 발생시키지 않고 나머지 문서를 계속 삽입하도록 설정
    // // 이를 통해 중복된 데이터가 있는 경우에도 오류가 발생하지 않고 나머지 문서가 삽입된다.
    // const options = { ordered: false };
    
    // // 위에서 생성한 컬렉션에 'docs' 배열에 있는 문서들을 'insertMany' 메서드를 사용하여 삽입
    // // options 옵션을 함께 전달하여 중복 데이터가 발견되어도 오류를 발생시키지 않고 나머지 문서를 삽입
    // // result 에는 삽입된 문서들의 정보가 담긴 객체가 반환된다.
    // const result = await coll.insertMany(docs, options);
    
    // // 삽입된 문서들의 '_id' 값을 출력
    // // result.insertedIds 는 삽입된 각 문서의 '_id'값을 가진 객체
    // // 이를 통해 어떤 문서들이 성공적으로 삽입되었는지 확인 가능
    // console.log(result.insertedIds);

    await db.collection('test').deleteOne({_id:1});
    
    /* Update */

    // filter 객체는 업데이트할 문서를 선택하는데 사용되는 조건을 지정한다.
    // 빈 객체 '{}'를 사용하여 모든 문서를 선택하고 있다.
    // 만약 특정 조건에 해당하는 문서만 업데이트 하려면 'filter' 객체에 해당 조건을 지정해야 한다.
    // ex) filter = { name: 'Comet Hyakutake' } 와 같이 이름이 'Comet Hyakutake'인 문서만 선택하도록 지정할 수 있다.
    // const filter = {};
    
    // // updateDoc 객체는 업데이트할 내용을 지정한다.
    // // $mul 연산자를 사용하여 'radius' 필드를 1.0204 를 곱셈하는 연산을 수행하고 있다.
    // // 이렇게 지정한 업데이트 연산은 선택된 모든 문서에 대해 적용된다.
    // // { $ml : { <field1> : <number1>, ....} }
    // const updateDoc = {
    //   $rename:
    //     {
    //       'mess':'test', 
    //     }
    // };

    // updateMany 메서드는 업데이트 된 문서의 수를 나타내는 'result.modifiedCount' 를 반환한다.
    // const result = await coll.updateMany(filter, updateDoc);
    // console.log("Number of documents updated: " + result.modifiedCount);

    // coll.find() 는 데이터베이스 컬렉션에서 모든 문서를 검색하는 쿼리를 생성한다.
    // 이 쿼리를 실행하면 결과로 'cursor' 라는 커서 객체가 반환된다.
    const cursor = coll.find();
    
    // toArray 메서드를 호출하여 커서의 모든 문서를 배열로 변환하여 data 라는 변수에 할당한다.
    const data = await cursor.toArray();
    console.log(data);
    
    io.on('connection', socket => {
      socket.emit('document', data);
    });

    console.log('Data sent to clients');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    // Ensures that the client will close when you finish/error
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
//   socket.onAny( event => {
//     console.log(`Socket Event: ${event}`);
//   });

//   console.log(`User Connected: ${socket.id}`);

//   socket.on('sendMessage', value => {
//     console.log(`${socket.id} send to message : ${value}`);
//   });

//   socket.on('disconnect', () => {
//     console.log('A user disconnected');
//   });
// });