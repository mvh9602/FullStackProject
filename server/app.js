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
const Redis = require("ioredis");
const csrf = require('csurf');

const port = process.env.PORT || process.env.NODE_PORT || 3000;
console.debug(process.env.MONGODB_URI);
const dbURL = process.env.MONGODB_URI || 'mongodb+srv://16hoffma:Seven77Seven@full-stack-project.30yar.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

console.debug(process.env.REDIS_URL);

const redisClient = new Redis(process.env.REDIS_URL);

redisClient.on("error", (...args) => {
  console.error(args);
});

redisClient.on("connect", () => {
  console.log("Redis connected");
})

const router = require('./router');

(async () => {
  try {
    console.log(dbURL);
    console.log("Redis connection: " + redisClient.connected);
    await mongoose.connect(dbURL, mongooseOptions);
  
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
  } catch (err) {
    console.error(err);
  }

})();

