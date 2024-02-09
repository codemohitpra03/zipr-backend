require('dotenv').config()
const express = require('express')
const bodyparser=require('body-parser');
const cookieParser=require('cookie-parser')
const cors = require('cors');


const {connectToMongoDB} = require('./connect.js')

const urlRoute = require('./routes/url')
const authRoute = require('./routes/auth.js')


const { redirectURL } = require('./controllers/url.js')





const app = express()
const PORT = 8000;



connectToMongoDB()

app.use(cookieParser());

app.use(bodyparser.urlencoded({extended : false}));
app.use(bodyparser.json());

const corsOptions = {
    
    origin: ['http://localhost:5173'], //included origin as true
    credentials: true, //included credentials as true
};

app.use("*",cors(corsOptions));





// app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.send('URL-shortner')
})


app.use('/url', urlRoute)
app.use('/auth',authRoute)

app.get('/:shortId', redirectURL)


app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`)
})