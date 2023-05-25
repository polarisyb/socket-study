# mongo-test-2

- mongoDB CRUD 연습을 위함

https://www.mongodb.com/docs/manual/

MongoDB는 문서 지향적인 NoSQL 데이터베이스로서, 문서를 JSON 형식의 BSON(Binary JSON)으로 저장하고 질의하며, 문서의 배열 형태로 삽입하는 기능을 제공한다.
이로 인해 MongoDB에서는 여러 개의 문서를 배열로 묶어 한 번에 삽입할 수 있는 메서드가 제공된다. { insertMany(), bulkWrite() ...}

MongoDB의 문서 지향적인 구조는 JSON 형태의 데이터를 직접 다룰 수 있으므로, 데이터를 배열 형태로 전달하여 효율적으로 다수의 문서를 삽입할 수 있다.
이는 MongoDB가 비정형 데이터를 처리하고 확장성이 뛰어난 데이터 모델을 가지고 있기 때문이다.

그러나 관계형 데이터베이스 시스템인 MySQL이나 MariaDB와 같은 전통적인 RDBMS는 스키마에 따라 구조화된 테이블 형태로 데이터를 저장하고 관리한다.
따라서 배열 형태로 데이터를 전달하여 여러 개의 레코드를 한 번에 삽입하는 기능은 제공되지 않는다.

따라서 MongoDB에서는 배열 형태로 데이터를 전달하여 다수의 문서를 삽입할 수 있지만, MySQL이나 MariaDB와 같은 관계형 데이터베이스에서는 다른 방식을 사용해야 한다.
