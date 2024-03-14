import bcrypt from 'bcryptjs';
import db from '../models';

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await hashUserPassword(data.password);
            console.log(data);
            await db.User.create({
                email: data.email,
                password: hashPassword,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId,
                phoneNumber: data.phoneNumber,
            });
            resolve('Successful!');
        } catch (error) {
            reject(error);
        }
    });
};

let hashUserPassword = (password) => {
    return new Promise((resolve, reject) => {
        try {
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash('B4c0//', salt, function (err, hash) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(hash);
                    }
                });
            });
        } catch (error) {
            reject(error);
        }
    });
};

let getAllUsers = () => {
    return new Promise(async (resolve, reject) => {
        try {
            resolve(
                await db.User.findAll({
                    raw: true,
                })
            );
        } catch (error) {
            reject(error);
        }
    });
};

let getUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {
                    id: userId,
                },
                raw: true,
            });
            resolve(user || {});
        } catch (error) {
            reject(error);
        }
    });
};

let updateUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {
                    id: data.id,
                },
            });
            if (user) {
                user.set(data);
                await user.save();
                resolve(
                    await db.User.findAll({
                        raw: true,
                    })
                );
            } else {
                resolve();
            }
        } catch (error) {
            reject(error);
        }
    });
};

let deleteUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {
                    id: data.id,
                },
            });
            if (user) {
                await user.destroy();
                resolve(
                    await db.User.findAll({
                        raw: true,
                    })
                );
            } else {
                resolve();
            }
        } catch (error) {
            reject('Error!');
        }
    });
};

module.exports = {
    createNewUser,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser,
};
