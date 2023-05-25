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

const run = async () => {
  try {

    await client.connect();

    await client.db('admin').command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    await listDatabases(client);
    
    console.log('Data sent to clients');

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