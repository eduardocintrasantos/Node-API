const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routers/tourRoutes');
const userRouter = require('./routers/userRoutes');

const app = express();

// 1) MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
    console.log('Hello from the middleware..');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// 2) ROUTER HANDLERS

// 3) ROUTERS
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// 4) START SERVER

module.exports = app;