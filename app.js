var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const dotenv = require('dotenv');
//導入express的第三方cors中間件 >> 解決跨域問題
const cors = require('cors');
//導入 express-session
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const mongoose = require('mongoose');


const movieRouter = require('./routes/movie');

const DB_URL = process.env.atlas_URL;

dotenv.config()

var app = express();

//設置 cors
app.use(
  cors({
    origin: 'https://fang-ting-chen.github.io',
    methods: 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    allowedHeaders: ['X-Requested-With', 'X-HTTP-Method-Override', 'Content-Type', 'Accept'],
    credentials: true,

  })
);

//連接mongodb atlas
mongoose.connect(DB_URL)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB Atlas', error);
  });


//設置 session 中間件
app.use(session({
  name: 'sid', //設置 cookie的name,默認值是: connect.sid
  secret: 'secretsecret', //參與加密的字符串(又稱簽名) 加鹽
  saveUninitialized: false, //是否為每次請求都設置一個cookie用來存儲session的id
  resave: true, //是否在每次請求時重新保存 session 
  store: MongoStore.create({
    mongoUrl: DB_URL //數據庫連接配置
  }),
  cookie: {
    httpOnly: true, //開啟後 前端無法通過 js操作
    maxAge: 1000 * 60 * 60 * 24, //控制sessionID的過期時間>24小時
    domain: 'github.io', //設置適當的域名
  },
}))



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//路由規則設置
app.use('/movie', movieRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Return the error response as JSON
  res.status(err.status || 500).json({
    message: err.message,
    // In production, do not expose stack trace or internal error details
    error: req.app.get('env') === 'development' ? err : {}
  });
  /*
  // render the error page
  res.status(err.status || 500);
  res.render('error');
  */
});

module.exports = app;
