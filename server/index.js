const express = require('express')
const session = require('express-session')
const massive = require('massive')
const dotenv = require('dotenv')
const PORT = 4000
const authCtrl = require('./controllers/authController');
const treasureCtrl = require('./controllers/treasureController')
const auth = require('./middleware/authMiddleware')


const app = express()

app.use(express.json())

const {CONNECTION_STRING, SESSION_SECRET} = process.env

massive({
    connectionString: CONNECTION_STRING,
    ssl: {rejectUnauthorized: false}
}).then(db => {
    app.set('db', db)
    console.log('db connected')
})

app.post('/auth/register', authCtrl.register)
app.post('/auth/login', authCtrl.login)
app.get('/auth/logout', authCtrl.logout)

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure);
app.get('/api/treasure/all', auth.usersOnly, treasureCtrl.getuAllTreasure)

app.use(
    session({
        resave: true,
        saveUninitialized: false,
        secret: SESSION_SECRET
    })
)





app.listen(PORT, () => console.log(`listening on port: ${PORT}`))