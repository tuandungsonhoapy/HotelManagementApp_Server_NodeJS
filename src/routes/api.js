import express from 'express';
import ApiBlogsController from '../controllers/ApiBlogsController';

let router = express.Router();

let initApiRoutes = (app) => {
    router.get('/blogs', ApiBlogsController.getBlogsList);
    router.post('/blogs', ApiBlogsController.createBlog);

    return app.use('/api/v1', router);
};

module.exports = initApiRoutes;
