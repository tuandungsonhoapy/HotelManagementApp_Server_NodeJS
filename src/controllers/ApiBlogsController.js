import BlogsService from '../services/BlogsService';

const getBlogsList = async (req, res) => {
    try {
        const response = await BlogsService.getBlogs();
        res.status(200).json(response);
    } catch (error) {
        res.status(502).send({
            error: {
                message: 'Can not get blogs list!',
            },
        });
    }
};

const createBlog = async (req, res) => {
    try {
        const data = req.body;
        console.log(req.body);
        const response = await BlogsService.createBlog(data);
        res.status(201).send(response);
    } catch (error) {
        res.status(503).send({
            error: {
                message: 'Can not create blog!',
            },
        });
    }
};

module.exports = {
    getBlogsList,
    createBlog,
};
