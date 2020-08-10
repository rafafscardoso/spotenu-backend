import express from 'express';

import { UserController } from '../../controller/UserController';

export const userRouter = express.Router();

const userController = new UserController();

userRouter.post('/signup', userController.signUp);

userRouter.put('/create/admin', userController.createAdmin);

userRouter.put('/create/band', userController.createBand);

userRouter.post('/login', userController.login);

userRouter.get('/band/all', userController.getAllBands);

userRouter.put('/approve/:id', userController.approveBand);

userRouter.get('/token', userController.getAccessTokenByRefreshToken);