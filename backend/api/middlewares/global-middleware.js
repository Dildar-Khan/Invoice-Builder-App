import logger from 'morgan';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import pdf from 'express-pdf';

import swaggerDocument from '../../config/swagger.json';
import { configureJWTStrategy } from './passport-jwt.js';
import { configureGoogleStrategy } from './passport-google.js';
import { devConfig } from '../../config/env/development.js';
import User from '../resources/user/user.model.js';
import { configureTwitterStrategy } from './passport-twitter.js';
import { configureGithubStrategy } from './passport-github.js';

export const setGlobalMiddleware = (app) => {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cors());
    app.use(pdf);
    app.use(logger('dev'));
    app.use(
        session({
            secret: devConfig.secret,
            resave: true,
            saveUninitialized: true,
        })
    );
    app.use(passport.initialize({ userProperty: 'currentUser' }));
    app.use(passport.session());
    configureJWTStrategy();
    configureGoogleStrategy();
    // configureTwitterStrategy();
    configureGithubStrategy();
    // save user into session
    // req.session.user = {userId}
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    // extract the userId from session
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(null, user);
        });
    });
    app.use(
        '/api-docs',
        swaggerUi.serve,
        swaggerUi.setup(swaggerDocument, { explorer: true })
    );
    // app.get('/failure', (req, res) => {
    //     return res.redirect('http://localhost:4200/login');
    // });
    app.get('/failure', (req, res) => {
        return res.redirect('/login');
    });
};
