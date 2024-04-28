import userService from '../services/UserService';

const getUsers = async (req, res) => {
    try {
        if (req.query.page && req.query.limit) {
            const { page, limit } = req.query;
            let response = await userService.getUsersWithPagination(
                +page,
                +limit
            );
            return res.status(200).json({
                message: response.message,
                code: response.code,
                data: response.data,
                status: 200,
            });
        } else {
            let response = await userService.getUsersService();
            return res.status(200).json({
                message: response.message,
                code: response.code,
                data: response.data,
                status: 200,
            });
        }
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

const updateUser = async (req, res) => {
    try {
        //Need to validate here
        let response = await userService.updateUserService(req.body);
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

const deleteUser = async (req, res) => {
    try {
        let response = await userService.deleteUserService(req.body.id);
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

const createUser = async (req, res) => {
    try {
        const { firstName, lastName, username, phone } = req.body;
        if (!firstName || !lastName || !username || !phone) {
            return res.status(400).json({
                message: 'Vui lòng nhập đầy đủ thông tin!',
                code: 1,
                data: '',
                status: 400,
            });
        }

        const response = await userService.createUserService(req.body);

        return res.status(200).json({
            message: response.message,
            code: response.code,
            data: response.data,
            status: 200,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            code: error.code,
            data: error.data,
            status: 500,
        });
    }
};

const getUserAccount = async (req, res) => {
    const data = {
        access_token: req.token,
        user: req.user,
    };
    console.log(data);
    return res.status(200).json({
        message: 'ok',
        code: 0,
        data: data,
    });
};

const searchUser = async (req, res) => {
    try {
        if (req.query.page && req.query.limit && req.query.search) {
            const { page, limit, search } = req.query;
            let response = await userService.searchUserWithPagination(
                +page,
                +limit,
                search
            );
            return res.status(200).json({
                message: response.message,
                code: response.code,
                data: response.data,
                status: 200,
            });
        }
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
    getUsers,
    updateUser,
    deleteUser,
    createUser,
    searchUser,
    getUserAccount,
};
