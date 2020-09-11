import express from 'express';

import { UserController } from '../../controller/UserController';

export const userRouter = express.Router();

const userController = new UserController();

userRouter.post('/signup', userController.signUp);

userRouter.put('/admin/create', userController.createAdmin);

userRouter.put('/band/create', userController.createBand);

userRouter.post('/login', userController.login);

userRouter.get('/band/approve', userController.getAllBandsToApprove);

userRouter.put('/approve/:id', userController.approveBand);

userRouter.put('/upgrade/:id', userController.upgradeFreeToPremium);

userRouter.put('/edit', userController.editProfile);

userRouter.get('/profile', userController.getProfile);

userRouter.get('/free/all', userController.getAllFree);