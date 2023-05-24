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
    
    // const docs = [
    //   {name: "Halley's Comet", officialName: "1P/Halley", orbitalPeriod: 75, radius: 3.4175, mass: 2.2e14},
    //   {name: "Wild2", officialName: "81P/Wild", orbitalPeriod: 6.41, radius: 1.5534, mass: 2.3e13},
    //   {name: "Comet Hyakutake", officialName: "C/1996 B2", orbitalPeriod: 17000, radius: 0.77671, mass: 8.8e12},
    //   {name: "Ct Hyakutake", officialName: "C/196 B2", orbitalPeriod: 1000, radius: 0.7771, mass: 8.8e2},
    //   {name: "Comet Hyaake", officialName: "C/199 B2", orbitalPeriod: 1700, radius: 0.7671, mass: 8.e2},
    // ];
    
    // // planets 컬렉션에 name 필드에 대한 Unique Index를 생성, name 필드는 고유한 값을 가지게 된다.
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
    
    const cursor = coll.find();
    const data = await cursor.toArray();
    
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