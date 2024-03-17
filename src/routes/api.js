import express from 'express';
import apiController from '../controllers/apiController';

const router = express.Router();

/**
 *
 * @param {*} app : express app
 */

const initApiRoutes = (app) => {
    //path, handler
    router.post('/register', apiController.handleRegister);

    return app.use('/api/v1', router);
};

export default initApiRoutes;
