import userService from '../services/UserService';

const getUsers = async (req, res) => {
    try {
        let response = await userService.getUsersService();
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

const updateUser = async (req, res) => {
    try {
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
};
