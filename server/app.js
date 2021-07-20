const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const url = require('url');
const redis = require('redis');
const csrf = require('csurf');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const dbURL = process.env.MONGODB_URI || 'mongodb://localhost/ForumProject';

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(dbURL, mongooseOptions, (err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});

let redisURL = {
  hostname: 'redis-13822.c276.us-east-1-2.ec2.cloud.redislabs.com',
  port: '13822',
};

let redisPASS = 'aT3heGFglRMZpPHAbjyXoTgI3pUyBG3J';
/*
if (process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  // eslint-disable-next-line
  redisPASS = redisURL.auth.split(':')[1];
}*/
const redisClient = redis.createClient({
  host: redisURL.hostname,
  port: redisURL.port,
  password: redisPASS,
});

console.log("Redis connection: " + redisClient.connected);

const router = require('./router');

const app = express();
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));
app.use(favicon(`${__dirname}/../hosted/img/favicon.ico`));

app.use(compression());
app.use(bodyParser.urlencoded({
  entended: true,
}));
app.use(session({
  key: 'sessionid',
  store: new RedisStore({ client: redisClient }),
  secret: 'Forum Fun',
  resave: true,
  saveUninitialized: true,
  cookie: { httpOnly: true },
}));
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views/`);
app.use(cookieParser());
app.disable('x-powered-by');

app.use(csrf());
app.use((err, req, res, next) => {
  console.log(req);
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

  console.log('Missing CSRF token');
  return false;
});

router(app);

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
