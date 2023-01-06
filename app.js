const express = require('express');
const fs = require('fs');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const exchangeRouter = require('./routes/exchangeRoutes');
const morganBody = require('morgan-body');
const bodyParser = require('body-parser');

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());
// Limit requests from same API
const limiter = rateLimit({
  max: async (req, res) => {
      const dayOfWeekDigit = new Date().getDay();
      const isWorkDay = dayOfWeekDigit > 4;  //days of the week goes 0 to 6.. monday, tuesday...etc 
    if (isWorkDay){
      return process.env.WORKDAY_RATE_LIMIT;
    }
    else{
      return process.env.WEEKEND_RATE_LIMIT;
    }
  },
  windowMs: process.env.RATE_LIMIT_WINDOW,
  message: process.env.RARE_LIMIT_MESSAGE
});

WORKDAY_RATE_LIMIT=100
WEEKEND_RATE_LIMIT=200
RATE_LIMIT_WINDOW = 3600000
RARE_LIMIT_MESSAGE = 'Too many requests from this IP, please try again in an hour!'
app.use('/api', limiter);

app.use(bodyParser.json());
const log = fs.createWriteStream(
  path.join(__dirname, "logs", "express.log"), { flags: "a" }
);

morganBody(app);

morganBody(app, {
  noColors: true,
  stream: log,
});

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

/* TODO Prevent parameter pollution ... for later 
app.use(
  hpp({
    whitelist: [

    ]
  })
);
*/

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

// 3) ROUTES

app.use('/api/v1/users', userRouter);
app.use('/api/v1/exchanges', exchangeRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
