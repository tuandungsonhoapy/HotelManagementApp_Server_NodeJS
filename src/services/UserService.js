import bcrypt from 'bcryptjs';
import db from '../models/index';

const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (userPassword) => {
    let hashPassword = bcrypt.hashSync(userPassword, salt);
    return hashPassword;
};

const checkEmailExist = async (email) => {
    let isExist = await db.User.findOne({
        where: { email: email },
    });

    if (isExist) return true;
    return false;
};

const checkPhoneExist = async (phone) => {
    let isExist = await db.User.findOne({
        where: { phone: phone },
    });

    if (isExist) return true;
    return false;
};

const registerNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email/phoneNumber are exist
            const isEmailExist = checkEmailExist(data.email);
            if (isEmailExist === true)
                return {
                    message: 'The email is already exist!',
                    code: 1,
                };
            const isPhoneExist = checkPhoneExist(data.phone);
            if (isPhoneExist === true)
                return {
                    message: 'The phone is already exist!',
                    code: 1,
                };

            //hash user password
            let hashPassword = hashUserPassword(data.password);

            //create new user
            await db.User.create({
                email: data.email,
                username: data.username,
                password: hashPassword,
                phone: data.phone,
                address: data.address,
            });

            resolve({
                message: 'A user is created successfully',
                code: 0,
            });
        } catch (error) {
            reject({
                message: 'Something worngs with server',
                code: 1,
            });
        }
    });
};

module.exports = {
    registerNewUser,
};
