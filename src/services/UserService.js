import bcrypt from 'bcryptjs';
import db from '../models/index';
import { Op } from 'sequelize';

const salt = bcrypt.genSaltSync(10);

const hashUserPassword = (userPassword) => {
    let hashPassword = bcrypt.hashSync(userPassword, salt);
    return hashPassword;
};

const checkEmailExist = async (userData) => {
    let isExist = await db.User.findOne({
        where: { username: userData },
    });

    if (isExist) return true;
    return false;
};

const checkPhoneExist = async (phoneData) => {
    let isExist = await db.User.findOne({
        where: { phone: phoneData },
    });

    if (isExist) return true;
    return false;
};

const registerNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email/phoneNumber are exist
            const isEmailExist = await checkEmailExist(data.username);
            if (isEmailExist === true) {
                reject({
                    message: 'Your username is already exist!',
                    code: 1,
                    data: '',
                });
                return;
            }
            const isPhoneExist = await checkPhoneExist(data.phone);
            if (isPhoneExist === true) {
                reject({
                    message: 'The phone is already exist!',
                    code: 1,
                    data: '',
                });
                return;
            }

            //hash user password
            let hashPassword = hashUserPassword(data.password);

            //create new user
            let newUser = await db.User.create({
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
                password: hashPassword,
                phone: data.phone,
            });
            console.log(newUser);
            resolve({
                message: 'A user is created successfully',
                code: 0,
                data: '',
            });
        } catch (error) {
            reject({
                message: 'Something worngs in service',
                code: -1,
                data: '',
            });
        }
    });
};

const checkPassword = (inputPassword, hashPassword) => {
    return bcrypt.compareSync(inputPassword, hashPassword);
};

const handleUserLogin = async (data) => {
    try {
        let user = await db.User.findOne({
            where: {
                [Op.or]: [{ username: data.username }],
            },
        });
        console.log(user.get({ plain: true }));
        if (user) {
            let isCorrectPassword = checkPassword(data.password, user.password);
            if (isCorrectPassword === true) {
                return {
                    message: 'Login successful!',
                    code: 0,
                    data: user.get({ plain: true }),
                };
            }
        }
        return {
            message: 'Your username or password is incorrect!',
            code: 1,
            data: '',
        };
    } catch (error) {
        return {
            message: 'Something wrongs with service!',
            code: -1,
            data: '',
        };
    }
};

module.exports = {
    registerNewUser,
    handleUserLogin,
};
