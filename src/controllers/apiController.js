import { sign } from 'jsonwebtoken';
import UserService from '../services/UserService';

const handleRegister = async (req, res) => {
    try {
        const {
            password,
            username,
            lastName,
            firstName,
            phone,
            confirmPassword,
        } = req.body;
        if (!firstName || !lastName || !phone || !password || !username) {
            return res.status(400).json({
                message: 'Missing required parameters!',
                code: 1,
                data: '',
                status: 400,
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                message: 'Password and confirmPassword are not the same!',
                code: 1,
                data: '',
                status: 400,
            });
        }

        if (password && password.length < 6) {
            return res.status(400).json({
                message: 'Your password must be at least 6 characters!',
                code: 1,
                data: '',
                status: 400,
            });
        }

        //service: create user
        let response = await UserService.registerNewUser(req.body);
        if (response.code === 0) {
            return res.status(200).json({
                message: response.message,
                code: response.code,
                data: response.data,
                status: 200,
            });
        } else {
            return res.status(400).json({
                message: response.message,
                code: response.code,
                data: response.data,
                status: 400,
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            code: error.code,
            data: '',
            status: 500,
        });
    }
};

const handleLogin = async (req, res) => {
    try {
        console.log(req.body);
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                message: 'Vui lòng nhập đầy đủ thông tin đăng nhập!',
                code: 1,
                data: '',
                status: 400,
            });
        }

        //service: login
        let response = await UserService.handleUserLogin(req.body);

        if (response && response.data && response.data.access_token) {
            res.cookie('jwt', response.data.access_token, {
                httpOnly: true,
                maxAge: 43200000, // Cookie sẽ hết hạn sau 12 giờ
            });
        }

        if (response.code === 0) {
            return res.status(200).json({
                message: response.message,
                code: response.code,
                data: response.data,
                status: 200,
            });
        } else {
            return res.status(400).json({
                message: response.message,
                code: response.code,
                data: response.data,
                status: 400,
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
            code: error.code,
            data: error.data,
            status: 500,
        });
    }
};

const handleLogout = async (req, res) => {
    try {
        res.clearCookie('jwt');
        return res.status(200).json({
            message: 'ok',
            code: 0,
            data: '',
            status: 200,
        });
    } catch (error) {
        return res.status(500).json({
            message: 'Logout failed!',
            code: -1,
            data: '',
            status: 500,
        });
    }
};

module.exports = {
    handleRegister,
    handleLogin,
    handleLogout,
};
