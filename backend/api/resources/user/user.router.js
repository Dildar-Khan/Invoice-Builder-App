import express from 'express';
import passport from 'passport';
import userController from './user.controller';
export const userRouter = express.Router();

userRouter.post('/signup', userController.signup);
userRouter.post('/login', userController.login);
userRouter.post('/forgotpassword', userController.forgotPassword);
userRouter.put(
    '/resetpassword',
    passport.authenticate('jwt', { session: false }),
    userController.resetPassword
);
