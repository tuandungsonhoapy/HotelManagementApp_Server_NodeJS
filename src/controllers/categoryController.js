import roleService from '../services/roleService';

const getCategories = async (req, res) => {
    try {
        let response = await roleService.getRolesService();
        return res.status(200).json({
            message: response.message,
            code: response.code,
            data: response.data,
            status: 200,
        });
    } catch (error) {
        console.log('>>>Error: ', error);
        return res.status(500).json({
            message: error.message,
            code: error.code,
            data: error.data,
            status: 500,
        });
    }
};

const createCategory = async (req, res) => {
    try {
        let response = await roleService.createCategoryService(req.body);
        return res.status(200).json({
            message: response.message,
            code: response.code,
            data: response.data,
            status: 200,
        });
    } catch (error) {
        console.log('>>>Error: ', error);
        return res.status(500).json({
            message: error.message,
            code: error.code,
            data: error.data,
            status: 500,
        });
    }
};

const deleteCategory = async (req, res) => {
    try {
        let response = await roleService.deleteRoleService(req.body.id);
        return res.status(200).json({
            message: response.message,
            code: response.code,
            data: response.data,
            status: 200,
        });
    } catch (error) {
        console.log('>>>Error: ', error);
        return res.status(500).json({
            message: error.message,
            code: error.code,
            data: error.data,
            status: 500,
        });
    }
};

const updateCategory = async (req, res) => {
    try {
        let response = await roleService.updateRolesService(req.body);
        return res.status(200).json({
            message: response.message,
            code: response.code,
            data: response.data,
            status: 200,
        });
    } catch (error) {
        console.log('>>>Error: ', error);
        return res.status(500).json({
            message: error.message,
            code: error.code,
            data: error.data,
            status: 500,
        });
    }
};

const searchCategory = async (req, res) => {
    try {
        let response = await roleService.searchRoleService(req.query.search);
        return res.status(200).json({
            message: response.message,
            code: response.code,
            data: response.data,
            status: 200,
        });
    } catch (error) {
        console.log('>>>Error: ', error);
        return res.status(500).json({
            message: error.message,
            code: error.code,
            data: error.data,
            status: 500,
        });
    }
};

module.exports = {
    getCategories,
    createCategory,
    deleteCategory,
    updateCategory,
    searchCategory,
};
