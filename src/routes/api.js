import express from 'express';
import apiController from '../controllers/apiController';
import userController from '../controllers/userController';
import groupController from '../controllers/groupController';

const router = express.Router();

/**
 *
 * @param {*} app : express app
 */

const initApiRoutes = (app) => {
    //path, handler
    router.post('/register', apiController.handleRegister);
    router.post('/login', apiController.handleLogin);
    router.get('/users', userController.getUsers);
    router.put('/user/update', userController.updateUser);
    router.delete('/user/delete', userController.deleteUser);
    router.get('/groups', groupController.getGroups);
    router.post('/user/create', userController.createUser);

    return app.use('/api/v1', router);
};

export default initApiRoutes;
