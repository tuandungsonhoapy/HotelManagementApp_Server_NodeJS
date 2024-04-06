require('dotenv').config();
import jwt from 'jsonwebtoken';

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

module.exports = {
    createJWT,
    verifyToken,
};
