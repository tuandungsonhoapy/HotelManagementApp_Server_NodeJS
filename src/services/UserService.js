import bcrypt from 'bcryptjs';
import db from '../models/index';
import { Op } from 'sequelize';
import { getGroupWithRoles } from './JWTService';
import { createJWT } from '../middleware/JWTAction';
require('dotenv').config();

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

            let groupId = data.groupId || 1;

            //create new user
            let newUser = await db.User.create({
                firstName: data.firstName,
                lastName: data.lastName,
                username: data.username,
                password: hashPassword,
                phone: data.phone,
                groupId: groupId,
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
            include: {
                model: db.Group,
                attributes: ['id', 'groupName'],
            },
        });
        if (user) {
            let isCorrectPassword = checkPassword(data.password, user.password);
            if (isCorrectPassword === true) {
                let groupWithRoles = await getGroupWithRoles(user.groupId);
                let payload = {
                    id: user.id,
                    username: user.username,
                };
                let token = createJWT(payload);
                return {
                    message: 'Login successful!',
                    code: 0,
                    data: {
                        access_token: token,
                        groupWithRoles,
                        user: {
                            id: user.id,
                            username: user.username,
                            avatar: user.avatar,
                        },
                    },
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

//Lấy danh sách người dùng
const getUsersService = async () => {
    try {
        let users = await db.User.findAll({
            attributes: [
                'id',
                'firstName',
                'lastName',
                'username',
                'phone',
                'avatar',
            ],
            include: {
                model: db.Group,
                attributes: ['id', 'groupName', 'description'],
            },
        });
        console.log('list User>>>>>..', users);
        if (users) {
            return {
                message: 'Get users successfully!',
                code: 0,
                data: users,
            };
        } else {
            return {
                message: 'Get users successfully!',
                code: 0,
                data: [],
            };
        }
    } catch (error) {
        return {
            message: 'Something wrongs with service!',
            code: -1,
            data: [],
        };
    }
};

const checkUsernameUpdate = async (username, id) => {
    console.log('>>>>>>>>>.username', username, '---id: ', id);
    let isExist = await db.User.findOne({
        where: {
            username: username,
            id: { [Op.ne]: id },
        },
    });

    console.log('>>>>>>>>>>>>>>>>>>>>>>>: ', isExist);

    if (isExist) return true;
    return false;
};

const checkPhoneUpdate = async (phone, id) => {
    let isExist = await db.User.findOne({
        where: {
            phone: phone,
            id: { [Op.ne]: id },
        },
    });

    if (isExist) return true;
    return false;
};

const updateUserService = async (data) => {
    try {
        const isUsernameExist = await checkUsernameUpdate(
            data.username,
            data.id
        );
        if (isUsernameExist === true) {
            return {
                message: 'Your username is already exist!',
                code: 1,
                data: 'username',
            };
        }
        const isPhoneExist = await checkPhoneUpdate(data.phone, data.id);
        if (isPhoneExist === true) {
            return {
                message: 'The phone is already exist!',
                code: 1,
                data: 'phone',
            };
        }

        let user = await db.User.findOne({
            where: { id: data.id },
        });
        if (user) {
            //Update user
            await user.update({
                firstName: data.firstName,
                lastName: data.lastName,
                phone: data.phone,
                username: data.username,
                groupId: data.groupId,
            });
            return {
                message: 'Update success!',
                code: 0,
                data: user,
                status: 200,
            };
        } else {
            return {
                message: 'Not found!',
                code: 1,
                data: '',
                status: 404,
            };
        }
    } catch (error) {
        return {
            message: 'Something wrongs with service!',
            code: -1,
            data: [],
        };
    }
};

const deleteUserService = async (id) => {
    try {
        const user = await db.User.findOne({
            where: { id: id },
        });
        if (user) {
            await user.destroy();
            return {
                message: 'Delete success!',
                code: 0,
                data: [],
                status: 200,
            };
        } else {
            return {
                message: 'Not found!',
                code: 1,
                data: [],
                status: 400,
            };
        }
    } catch (error) {
        return {
            message: 'Something wrongs with service!',
            code: -1,
            data: [],
        };
    }
};

const getUsersWithPagination = async (page, limit) => {
    try {
        let offset = (page - 1) * limit;
        const { count, rows } = await db.User.findAndCountAll({
            attributes: [
                'id',
                'firstName',
                'lastName',
                'username',
                'phone',
                'avatar',
                'groupId',
            ],
            include: {
                model: db.Group,
                attributes: ['id', 'groupName', 'description'],
            },
            offset: offset,
            limit: limit,
            order: [['id', 'DESC']],
        });
        let totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            users: rows,
        };

        return {
            message: 'Get users successfully!',
            code: 0,
            data: data,
        };
        // console.log('list User>>>>>..', users);
        // if (users) {
        //     return {
        //         message: 'Get users successfully!',
        //         code: 0,
        //         data: users,
        //     };
        // } else {
        //     return {
        //         message: 'Get users successfully!',
        //         code: 0,
        //         data: [],
        //     };
        // }
    } catch (error) {
        return {
            message: 'Something wrongs with service!',
            code: -1,
            data: [],
        };
    }
};

const createUserService = async (data) => {
    try {
        const isEmailExist = await checkEmailExist(data.username);
        if (isEmailExist === true) {
            return {
                message: 'Your username is already exist!',
                code: 1,
                data: 'username',
            };
        }
        const isPhoneExist = await checkPhoneExist(data.phone);
        if (isPhoneExist === true) {
            return {
                message: 'The phone is already exist!',
                code: 1,
                data: 'phone',
            };
        }

        //hash user password
        let hashPassword = hashUserPassword('123456');

        await db.User.create({
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.username,
            password: hashPassword,
            phone: data.phone,
            groupId: data.groupId,
        });

        return {
            message: 'Create user successfully!',
            code: 0,
            data: '',
        };
    } catch {
        () => {
            return {
                message: 'Something wrongs with service!',
                code: -1,
                data: '',
            };
        };
    }
};

const searchUserWithPagination = async (page, limit, search) => {
    try {
        let offset = (page - 1) * limit;
        const { count, rows } = await db.User.findAndCountAll({
            attributes: [
                'id',
                'firstName',
                'lastName',
                'username',
                'phone',
                'avatar',
                'groupId',
            ],
            include: {
                model: db.Group,
                attributes: ['id', 'groupName', 'description'],
            },
            where: {
                [Op.or]: [
                    {
                        username: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                    {
                        phone: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                    {
                        firstName: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                    {
                        lastName: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                    {
                        '$Group.groupName$': {
                            [Op.like]: `%${search}%`,
                        },
                    },
                ],
            },
            offset: offset,
            limit: limit,
            order: [['id', 'DESC']],
        });
        let totalPages = Math.ceil(count / limit);
        let data = {
            totalRows: count,
            totalPages: totalPages,
            users: rows,
        };

        return {
            message: 'Get users successfully!',
            code: 0,
            data: data,
        };
    } catch (error) {
        return {
            message: 'Something wrongs with service!',
            code: -1,
            data: [],
        };
    }
};

const getUserInfomation = async (userId, username) => {
    try {
        const user = await db.User.findOne({
            attributes: ['id', 'username', 'groupId'],
            where: {
                [Op.and]: [{ id: userId }, { username: username }],
            },
        });
        if (user) {
            const groupWithRoles = await getGroupWithRoles(user.groupId);
            return {
                message: 'get user success!',
                code: 0,
                data: {
                    id: user.id,
                    username: user.username,
                    groupWithRoles,
                },
            };
        }
        return {
            message: 'get user infomation fail!',
            code: 1,
            data: {},
        };
    } catch (error) {
        return {
            message: 'Something wrongs with server!',
            code: -1,
            data: {},
        };
    }
};

module.exports = {
    registerNewUser,
    handleUserLogin,
    getUsersService,
    updateUserService,
    deleteUserService,
    getUsersWithPagination,
    createUserService,
    searchUserWithPagination,
    getUserInfomation,
};

export {
    registerNewUser,
    handleUserLogin,
    getUsersService,
    updateUserService,
    deleteUserService,
    getUsersWithPagination,
    createUserService,
    searchUserWithPagination,
    getUserInfomation,
};
