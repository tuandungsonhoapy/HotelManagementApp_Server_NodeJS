import express from 'express';
import apiController from '../controllers/apiController';
import userController from '../controllers/userController';
import groupController from '../controllers/groupController';
import { checkUserJWT, checkUserPermission } from '../middleware/JWTAction';

const router = express.Router();

/**
 *
 * @param {*} app : express app
 */
const checkUser = (req, res, next) => {
    const nonSecurePaths = ['/register', '/login'];
    if (nonSecurePaths.includes(req.path)) return next();

    next();
};

const initApiRoutes = (app) => {
    router.all('*', checkUserJWT, checkUserPermission);
    //path, handler
    router.post('/register', apiController.handleRegister);
    router.post('/login', apiController.handleLogin);
    router.get('/account', userController.getUserAccount);
    router.get('/users', userController.getUsers);
    router.put('/user/update', userController.updateUser);
    router.delete('/user/delete', userController.deleteUser);
    router.get('/groups', groupController.getGroups);
    router.post('/user/create', userController.createUser);

    return app.use('/api/v1', router);
};

export default initApiRoutes;
