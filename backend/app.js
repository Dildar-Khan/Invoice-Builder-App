import express from 'express';
import mongoose from 'mongoose';
import path from 'path';

import { restRouter } from './api/index.js';
import { devConfig } from './config/env/development.js';
import { setGlobalMiddleware } from './api/middlewares/global-middleware.js';

mongoose.Promise = global.Promise;
const mongoDBUrl = devConfig.database;

mongoose
    .connect(mongoDBUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((db) => {
        console.log('Database is connected');
    })
    .catch((error) => console.log(error));

const app = express();
const PORT = devConfig.port;

setGlobalMiddleware(app);

app.use('/api', restRouter);

app.use('/', express.static(path.join(__dirname, 'angular')));
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'angular', 'index.html'));
});

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.message = 'Invalid route';
    error.status = 404;
    next(error);
});

// Error Handling Middleware
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.json({
        error: {
            message: error.message,
        },
    });
});

app.listen(PORT, () => {
    console.log('Server is connected to port: ', PORT);
});
