# nodejs & express & mySQL 연동 샘플 

이번 아티클은 nodejs, express, mySQL 을 이용하여 간단한 CRUD 를 수행하는 REST API 를 만들어 볼 것입니다.

## 기능 설명

사용자 테이블이 필요합니다. 
name, age, role 를 가지고 있는 사용자이며, 이 사용자의 정보를 CRUD 해보도록 할 것입니다. 

## REST API 

- GET /users : 전체 사용자 목록을 확인한다. 
- GET /user/search:name : 이름으로 사용자를 검색합니다.
- GET /user/2 : 사용자 아이디를 이용하여 조회합니다. 
- POST /user : 신규 사용자를 등록합니다. 
- DELETE /user : 사용자를 삭제합니다. (userId를 받습니다.)
- PUT /user : 사용자 나이를 수정합니다. 

## 준비물 

우선 DB 를 하나 만들겠습니다. 데이터베이스 정보는 다음과 같습니다. 

### 계정정보 

```
Schema : express
id/password : express/express 
```

### 테이블 생성하기 

```
CREATE TABLE `UserInfo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `age` int(11) NOT NULL,
  `role` enum('ADMIN','USER','GUEST') NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

### 기본 사용자 인서트하기 

```
INSERT INTO UserInfo (name, age, role) VALUES 
('kido', 20, 'ADMIN'),
('kang', 30, 'GUEST'),
('Go', 10, 'USER'),
('No', 50, 'ADMIN'),
('SK', 25, 'USER');
```

## node 설치및 의존성 설치하기 

우선 우리는 nodejs 가 설치되어 있어야합니다. 

[nodejs](https://nodejs.org/ko/download/) 에서 다운로드 받아서 설치해줍니다. 

### 디렉토리 생성하기 

```
mkdir express_restapi
cd express_restapi
```

### 노드 프로젝트 초기화 하기. 

```
npm install -y
```

### 의존성 패키지 설치하기 (express, mysql, body-parser)

```
npm install express --save
npm install mysql --save
npm install body-parser --save
```

## 기본적인 서버 만들어보기. 

### 신규 파일 만들기 

```
touch server-base.js
vim server-base.js
```

### 기본 서버 코드 작성하기 

아래와 같이 코드를 작성해줍니다. \
아래 코드는 가장 기본적인 express 의 구조를 나타내 줍니다. 

```
// express 모듈을 로드 합니다 .
const express = require('express')
// express 모듈 객체를 생성합니다. 이제부터 http 통신은 app 이라는 객체 인스턴스를 통해서 가능합니다. 
const app = express();
// body-parser 는 request 를 파싱해서 서버에서 쉽게 접근할 수 있도록 해줍니다. 
const bodyParser = require('body-parser')

// 서버를 기동시킬 기본 포트를 잡아줍니다. 
const port = 8080; 

// body-parser 가 json을 파싱할 수 있도록 사용등록을 합니다. 
app.use(bodyParser.json());
// body-parser 가 인코딩을 수행하도록 합니다. 
app.use(bodyParser.urlencoded({
    extended: true
}))


// 기본 GET 요청을 위한 루트 REST API 를 하나 만듭니다. 
app.get('/', (req, res) => {
    res.send('Hello express!!!');
})

// 서버를 기동시켜서 요청을 기다리도록 만듭니다. 
app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
    console.log('Node app is running on port ' + port);
})
```

### 서버 기동시키고 확인하기. 

```
node server-base.js
```

아래 메시지가 콘솔에 로드 되는지 확인합니다. 

Node app is running on port 8080 


### 요청 보내보기 

```
curl http://localhost:8080/
Hello express!!!
```

위와 같이 Hello express!!! 가 나타나면 정상적으로 서버가 동작한 것입니다. 


## 본격적으로 REST API 만들기. 

### mysql 모듈 등록하기. 

이제는 mysql 을 등록해서 서버와 연동을 해야합니다. 

```
...
const mysql = require('mysql');

const port = 8080;

// Mysql Connection
const mycon = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'express',
    password: 'express',
    database: 'express'
})
...
```

mysql 모듈을 로드하기 위해서 const mysql = require('mysql'); 을 이용했습니다. 

그리고나서 mysql.createConnecdtion 을 통해서 서버와 커넥션을 맺습니다. 

### 전체 사용자 목록 가져오기. 

이제는 전체 사용자 목록을 가져오기 위해서 요청과 DB 조회를 해보겠습니다. 

#### 코드 작성하기 

GET /users

```
app.get('/users', (req, res) => {
    mycon.query(
        'SELECT * FROM UserInfo', 
        (error, results, fields) => {
            if (error) throw error
            return res.send({error: false, data: results, message: 'All User Info list.'})
        }
    )
})
```

엔드포인트는 /users 입니다. 

모든 REST API 는 요청(req), 응답(res) 를 이용합니다.

즉, 위 코드는 '/users' 요청이 들어오면 

```
콜백 함수로 (req, res) => {...} 
```

로 받아라는 의미입니다. 


mycon.query 를 이용하는 것을 확인해 보세요. 

이 구조는 다음과 같습니다. 

```
mycon.query(
    <쿼리부분>,
    <파라미터부분 - 생략가능>,
    <콜백 함수>
)
```

#### 결과 확인하기. 

```
curl http://localhost:8080/users
```

```
{"error":false,"data":[{"id":1,"name":"kido","age":20,"role":"ADMIN","createdAt":"2019-02-19T01:43:11.000Z"},{"id":2,"name":"kang","age":30,"role":"GUEST","createdAt":"2019-02-19T01:43:11.000Z"},{"id":3,"name":"Go","age":10,"role":"USER","createdAt":"2019-02-19T01:43:11.000Z"},{"id":4,"name":"No","age":50,"role":"ADMIN","createdAt":"2019-02-19T01:43:11.000Z"},{"id":5,"name":"SK","age":25,"role":"USER","createdAt":"2019-02-19T01:43:11.000Z"}],"message":"All User Info list."}
```

위와 같이 결과가 나왔으면 정상입니다. 


### 사용자 아이디로 검색하기. 

이번에는 사용자 이름을 파라미터로 받아서 검색하는 GET 메소드를 만들어 보겠습니다. 

GET /user/:id

#### 코드 작성하기 

달라진 부분은 :id 로 pathVariable 가 추가된 것입니다.

해당 파라미터는 req.params.id 로 조회할 수 있습니다. 

```
app.get('/users/:id', (req, res) => {
    let userId = Number(req.params.id);
    if (!userId) {
        return res.status(400).send({error: true, message: 'You have to provide userId.'})
    }

    mycon.query(
        'SELECT * FROM UserInfo WHERE id=?',
        userId,
        (error, results, fields) => {
            if (error) throw error;
            return res.send({error: false, data: results[0], message:'Get UserInfo by Id.'})
        }
    )

})
```

위 코드에서 사용자 ID 는 쿼리를 실행하기 위한 필수 값입니다. 이 값이 없다면 위와 같이 400 응답오류를 보내게 됩니다. 


#### 결과 확인하기 

```
curl http://localhost:8080/user/1
```

```
{"error":false,"data":{"id":2,"name":"kang","age":30,"role":"GUEST","createdAt":"2019-02-19T01:43:11.000Z"},"message":"Get UserInfo by Id."}
```

### 사용자 이름 검색하기=

이번에는 이름으로 검색해보도록 하겠습니다. 

GET /user/search/:name

#### 코드 작성하기 

```
app.get('/user/search/:name', (req, res) => {
    let name = req.params.name;
    if (!name) {
        return res.status(400).send({error: true, message: 'You have to provide userName.'})
    }

    mycon.query(
        'SELECT * FROM UserInfo WHERE name LIKE ?',
        ['%' + name + '%'],
        (error, results, fields) => {
            if (error) throw error;
            return res.send({error: false, data: results, message: 'Get UserInfo lists by userName.'})
        }
    )
})
```

#### 결과 확인하기 

```
curl http://localhost:8080/user/search/ki
```

```
{"error":false,"data":[{"id":1,"name":"kido","age":20,"role":"ADMIN","createdAt":"2019-02-19T01:43:11.000Z"},{"id":6,"name":"kiddo","age":99,"role":"GUEST","createdAt":"2019-02-19T02:00:08.000Z"}],"message":"Get UserInfo lists by userName."}
```

### 사용자 정보 신규 생성하기 

이번에는 사용자 정보를 신규로 생성해 보겠습니다. 

요청 정보를 json 로 받아서 그대로 DB 필드에 입력하고 있는 부분을 하십시오. 

POST /user 

#### 코드 작성하기 

```
app.post('/user', (req, res) => {
    let userInfo = req.body;

    if (!userInfo) {
        return res.status(400).send({ error: true, message: 'You have to provide userInfos.'})
    }

    mycon.query(
        'INSERT INTO UserInfo SET ? ', 
        [userInfo],
        (error, results, fields) => {
            if (error) throw error
            return res.send({ error: false, data: results, message: 'Create new UserInfo successfully.'})
        }
    )
})
```

POST 는 신규 데이터를 생성하는 HTTP 메소드 입니다. 

위 코드에서 req.body 로 해당 코드를 받고 있습니다. 

쿼리 구문은 body 의 내용을 그대로 SET 을 통해서 인서트 하고 있습니다. 

#### 결과 확인하기 

```
curl -X POST http://localhost:8080/user -H 'Content-Type: application/json' -d '{"name":"kidod2", "age":45, "role":"GUEST"}'
```

```
{"error":false,"data":{"fieldCount":0,"affectedRows":1,"insertId":7,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0},"message":"Create new UserInfo successfully."}
```

### 삭제하기 

이번에는 DELETE method 를 이용하여 사용자 정보를 아이디를 이용하여 삭제하도록 하겠습니다. 

삭제도 사실 달라질 내용은 없습니다. 

DELETE /user

#### 코드 작성하기 

```
app.delete('/user', (req, res) => {
    let userId = req.body.userId;
    console.log(req.body);

    if (!userId) {
        return res.status(400).send({error: true, message: 'You have to provide userId'})
    }

    mycon.query(
        'DELETE FROM UserInfo WHERE id = ?', 
        [userId],
        (error, results, fields) => {
            if (error) throw error
            return res.send({error: false, data: results, message: 'Delete UserInfo by userId successfully.'})
        }
    )
})
```

#### 결과 확인하기 

```
curl -X DELETE http://localhost:8080/user -H 'Content-Type: application/json' -d '{"userId":7}'
```

```
{"error":false,"data":{"fieldCount":0,"affectedRows":1,"insertId":0,"serverStatus":2,"warningCount":0,"message":"","protocol41":true,"changedRows":0},"message":"Delete UserInfo by userId successfully."}
```

### 데이터 수정하기 

사용자 아이디, age 를 받아서 아이디에 해당하는 age 를 수정하는 코드를 작성하고 테스트 해보겠습니다. 

PUT /user

#### 코드 작성하기 

```
app.put('/user', (req, res) => {
    let userId = req.body.userId;
    let age = req.body.age;
    if (!userId || !age) {
        return res.status(400).send({error: true, message: 'You have to provide age with a userId.'})
    }

    mycon.query(
        'UPDATE UserInfo SET age = ? WHERE id = ? ',
        [age, userId],
        (error, results, fields) => {
            if (error) throw error;
            return res.send({error: false, data: results, message: 'UserInfo has been updated successfully.'})
        }
    )
})
```

#### 결과 확인하기 

```
curl -X PUT http://localhost:8080/user -H 'Content-Type: application/json' -d '{"userId":6, "age":99}'
```

```
{"error":false,"data":{"fieldCount":0,"affectedRows":1,"insertId":0,"serverStatus":2,"warningCount":0,"message":"(Rows matched: 1  Changed: 1  Warnings: 0","protocol41":true,"changedRows":1},"
```