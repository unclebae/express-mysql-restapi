const express = require('express')
const app = express()
const bodyParser = require('body-parser')
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

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

app.get('/', (req, res) => {
    return res.send({ error: true, message: 'hello'})
})

app.get('/users', (req, res) => {
    mycon.query(
        'SELECT * FROM UserInfo', 
        (error, results, fields) => {
            if (error) throw error
            return res.send({error: false, data: results, message: 'All User Info list.'})
        }
    )
})

app.get('/user/:id', (req, res) => {
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


app.listen(port, (err) => {
    if (err) {
        console.log(err);
    }
    console.log('Node app is running on port ' + port);
})