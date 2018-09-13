//importing modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
var port = 8000;
const url = 'mongodb://stockPingApp:rishi0neha0dev@ds235352.mlab.com:35352/stock-ping-db';
const app = express();

//middleware to parse data
//important as the POST request body will be undefined if not initialized as below
app.use(cors());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

const route = require('./routes/route');

//connect to mongodb (mLab)
mongoose.connect(url, {
    useNewUrlParser: true
});

//mongodb event messages
mongoose.connection.on('connected', function () {
    console.log('---connected to mLab (DB)---');
});
mongoose.connection.on('error', function (err) {
    if (err) {
        throw err;
    }
});

//specify route for REST api
app.use('/api', route);

//static files like index.html
app.use(express.static(path.join(__dirname, 'public')));

app.listen(process.env.PORT || port, function () {
    console.log(`---Server running on ${port}---`);
});