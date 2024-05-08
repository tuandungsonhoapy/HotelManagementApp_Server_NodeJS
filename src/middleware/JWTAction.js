require('dotenv').config();
import jwt from 'jsonwebtoken';

const nonSecurePaths = [
    '/register',
    '/login',
    '/logout',
    '/rooms',
    '/room/search',
    '/room/empty-by-category',
    '/room/',
];

const nonPermissionPaths = ['/account'];

const createJWT = (payload) => {
    let key = process.env.JWT_SECRET;
    let token = null;
    try {
        token = jwt.sign(payload, key, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });
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

const extractToken = (req) => {
    if (
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'Bearer'
    ) {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
};

const checkUserJWT = (req, res, next) => {
    if (nonSecurePaths.includes(req.path)) return next();
    for (let path of nonSecurePaths) {
        if (req.path.includes(path)) {
            return next();
        }
    }
    let cookies = req.cookies;
    let tokenFromHeaders = extractToken(req);
    if ((cookies && cookies.jwt) || tokenFromHeaders) {
        let token = cookies && cookies.jwt ? cookies.jwt : tokenFromHeaders;
        let decoded = verifyToken(token);
        if (decoded) {
            req.user = decoded;
            console.log('>>> User: ', req.user);
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
    if (nonSecurePaths.includes(req.path)) return next();
    for (let path of nonPermissionPaths) {
        if (req.path.includes(path)) {
            return next();
        }
    }
    for (let path of nonSecurePaths) {
        if (req.path.includes(path)) {
            return next();
        }
    }

    if (req.user) {
        let { username, groupWithRoles } = req.user;
        let roles = groupWithRoles.Roles;
        let currentUrl = req.path;
        if (!roles || roles.length === 0) {
            return res.status('403').json({
                message: `You don't have permission to access this url!`,
                code: -3,
                data: '',
                status: '403',
            });
        }

        let canAccess = roles.some(
            (item) => item.url === currentUrl || currentUrl.includes(item.url)
        );
        if (canAccess === true) {
            next();
        } else {
            return res.status('403').json({
                message: `You don't have permission to access this url!`,
                code: -3,
                data: '',
                status: '403',
            });
        }
    } else {
        return res.status('401').json({
            message: 'Not authenticated the user',
            code: -2,
            data: '',
            status: '401',
        });
    }
};

module.exports = {
    createJWT,
    verifyToken,
    checkUserJWT,
    checkUserPermission,
};
