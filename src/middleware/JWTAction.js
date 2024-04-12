require('dotenv').config();
import jwt from 'jsonwebtoken';

const nonSecurePaths = ['/register', '/login'];

const createJWT = (payload) => {
    let key = process.env.JWT_SECRET;
    let token = null;
    try {
        token = jwt.sign(payload, key);
    } catch (error) {
        console.log('>>> Error token: ', error);
    }
    // console.log(token);
    return token;
};

const verifyToken = (token) => {
    const key = process.env.JWT_SECRET;
    let data = null;
    try {
        let data = jwt.verify(token, key);
        return data;
    } catch (error) {
        console.log(error);
    }
    return data;
};

const checkUserJWT = (req, res, next) => {
    if (nonSecurePaths.includes(req.path)) return next();

    let cookies = req.cookies;
    if (cookies && cookies.jwt) {
        let token = cookies.jwt;
        let decoded = verifyToken(token);
        if (decoded) {
            req.user = decoded;
            req.token = token;
            next();
        } else {
            return res.status('401').json({
                message: 'Not authenticated the user',
                code: -1,
                data: '',
            });
        }
    } else {
        return res.status('401').json({
            message: 'Not authenticated the user',
            code: -1,
            data: '',
        });
    }
};

const checkUserPermission = (req, res, next) => {
    if (nonSecurePaths.includes(req.path) || req.path === '/account')
        return next();

    if (req.user) {
        let { username, groupWithRoles } = req.user;
        let roles = groupWithRoles.Roles;
        let currentUrl = req.path;
        if (!roles || roles.length === 0) {
            return res.status('403').json({
                message: `You don't have permission to access this url!`,
                code: -1,
                data: '',
            });
        }

        let canAccess = roles.some((item) => item.url === currentUrl);
        if (canAccess === true) {
            next();
        } else {
            return res.status('403').json({
                message: `You don't have permission to access this url!`,
                code: -1,
                data: '',
            });
        }
    } else {
        return res.status('401').json({
            message: 'Not authenticated the user',
            code: -1,
            data: '',
        });
    }
};

module.exports = {
    createJWT,
    verifyToken,
    checkUserJWT,
    checkUserPermission,
};
