import bcrypt from 'bcryptjs';
import db from '../models/index';
import { Op } from 'sequelize';
import { raw } from 'body-parser';

const getCategoriesService = async () => {
    try {
        let data = await db.Category.findAll();
        return {
            message: 'Roles fetched successfully',
            code: 'GET_ROLES_SUCCESS',
            data: data,
        };
    } catch (error) {
        console.log('>>>Error: ', error);
        return {
            message: error.message,
            code: 'GET_ROLES_ERROR',
            data: [],
        };
    }
};

const checkCategoryExist = async (category) => {
    try {
        let data = await db.Category.findOne({
            where: {
                categoryName: category.categoryName,
            },
        });
        return data;
    } catch (error) {
        console.log('>>>Error: ', error);
        return null;
    }
};

const createCategoryService = async (categories) => {
    try {
        let existingCategories = await db.Category.findAll({
            where: {
                categoryName: {
                    [Op.in]: categories.map(
                        (category) => category.categoryName
                    ),
                },
            },
            raw: true,
        });
        console.log('>>>>>>>>>>>existingRoles: ', existingCategories);
        let diffCategories = categories.filter((category) => {
            return !existingRoles.some(
                (existingCategory) =>
                    existingCategory.categoryName === category.categoryName
            );
        });
        console.log('>>>>>>>>>>>diffRoles: ', diffRoles);
        if (diffCategories.length === 0) {
            return {
                message: 'All categories already exist',
                code: 1,
                data: null,
            };
        }
        const data = await db.Category.bulkCreate(diffCategories);
        console.log('>>>>>>>>>>>data: ', data);
        return {
            message: `${diffRoles.length} Category created successfully`,
            code: 0,
            data: data,
        };
    } catch (error) {
        console.log('>>>Error: ', error);
        return {
            message: error.message,
            code: -1,
            data: null,
        };
    }
};

const deleteCategoryService = async (id) => {
    try {
        const roleDB = await db.Category.findOne({
            where: {
                id: id,
            },
        });
        if (roleDB) {
            await roleDB.destroy();
            return {
                message: `Category deleted successfully`,
                code: 0,
                data: roleDB,
            };
        } else {
            return {
                message: `Category not found`,
                code: 1,
                data: [],
            };
        }
    } catch (error) {
        console.log('>>>Error: ', error);
        return {
            message: error.message,
            code: -1,
            data: null,
        };
    }
};

const updateCategoryService = async (categories) => {
    let existCount = 0;
    try {
        for (let category of categories) {
            const roleDB = await db.Category.findOne({
                where: {
                    id: category.id,
                },
            });

            const roleExist = await checkCategoryExist(category);
            if (roleDB && !roleExist) {
                await roleDB.update(category);
            } else {
                existCount++;
            }
        }
        return {
            message: `${
                categories.length - existCount
            } categories updated successfully and ${existCount} categories already exist`,
            code: 0,
            data: [],
        };
    } catch (error) {
        return {
            message: error.message,
            code: -1,
            data: [],
        };
    }
};

const searchCategoryService = async (search) => {
    try {
        let data = await db.Category.findAll({
            where: {
                [Op.or]: [
                    {
                        categoryName: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                    {
                        description: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                ],
            },
        });
        return {
            message: `${data.length} categories found`,
            code: 0,
            data: data,
        };
    } catch (error) {
        console.log('>>>Error: ', error);
        return {
            message: error.message,
            code: -1,
            data: [],
        };
    }
};

module.exports = {
    getCategoriesService,
    createCategoryService,
    deleteCategoryService,
    updateCategoryService,
    searchCategoryService,
};
