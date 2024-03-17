import UserService from '../services/UserService';

const handleRegister = async (req, res) => {
    try {
        const { email, password, username, address, phone } = req.body;
        if (!email || !phone || !password || !username || !address) {
            return res.status(200).json({
                message: 'Missing required parameters',
                code: 1,
                data: '',
            });
        }

        //service: create user
        let response = await UserService.registerNewUser(req.body);

        return res.status(200).json({
            message: response.message,
            code: response.code,
            data: '',
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Error from server',
            code: -1,
            data: '',
        });
    }
};

module.exports = {
    handleRegister,
};
