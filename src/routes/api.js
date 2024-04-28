import express from 'express';
import apiController from '../controllers/apiController';
import userController from '../controllers/userController';
import groupController from '../controllers/groupController';
import { checkUserJWT, checkUserPermission } from '../middleware/JWTAction';
import roleController from '../controllers/roleController';
import categoryController from '../controllers/categoryController';

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

    //login, register, logout
    router.post('/register', apiController.handleRegister);
    router.post('/login', apiController.handleLogin);
    router.post('/logout', apiController.handleLogout);
    router.get('/account', userController.getUserAccount);

    //user
    router.get('/users', userController.getUsers);
    router.put('/user/update', userController.updateUser);
    router.delete('/user/delete', userController.deleteUser);
    router.post('/user/create', userController.createUser);
    router.get('/user/search', userController.searchUser);

    //group
    router.get('/groups', groupController.getGroups);

    //role
    router.get('/roles', roleController.getRoles);
    router.post('/role/create', roleController.createRole);
    router.delete('/role/delete', roleController.deleteRole);
    router.put('/role/update', roleController.updateRole);
    router.get('/role/search', roleController.searchRole);
    router.get('/role/by-group', roleController.getRolesByGroup);
    router.post('/role/assign-role', roleController.assignRoleToGroup);

    //category
    router.get('/categories', categoryController.getCategories);
    router.post('/category/create', categoryController.createCategory);
    router.delete('/category/delete', categoryController.deleteCategory);
    router.put('/category/update', categoryController.updateCategory);
    router.get('/category/search', categoryController.searchCategory);

    return app.use('/api/v1', router);
};

export default initApiRoutes;
