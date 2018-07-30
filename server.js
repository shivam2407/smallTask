const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const userRouter = require('./routers/user');

const app = express();
mongoose.connect('mongodb://localhost:27017/flare', {
  useNewUrlParser: true,
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/user', userRouter);
// start server on port 3000
app.listen(3000, () => {
    console.log('server istening on port 3000');
});

module.exports = app;
