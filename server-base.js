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