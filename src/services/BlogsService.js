import bcrypt from 'bcryptjs';
import db from '../models';

const getBlogs = () => {
    return new Promise(async (resolve, reject) => {
        try {
            resolve(
                await db.Blog.findAll({
                    raw: true,
                })
            );
        } catch (error) {
            reject(error);
        }
    });
};

const createBlog = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(data);
            const blog = await db.Blog.create({
                title: data.title,
                featuredImage: data.featuredImage,
                description: data.description,
                publishDate: data.publishDate,
                publish: publish,
            });
            resolve(blog);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    getBlogs,
    createBlog,
};
