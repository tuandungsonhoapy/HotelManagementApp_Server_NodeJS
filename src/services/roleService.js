import bcrypt from 'bcryptjs';
import db from '../models/index';
import { Op } from 'sequelize';
import { raw } from 'body-parser';

const getRolesService = async () => {
    try {
        let data = await db.Role.findAll();
        return {
            message: 'Roles fetched successfully',
            code: 'GET_ROLES_SUCCESS',
            data: data,
        };
    } catch (error) {
        console.log('>>>Error: ', error);
        return {
            message: error.message,
            code: 'GET_ROLES_ERROR',
            data: [],
        };
    }
};

const checkRoleExist = async (role) => {
    try {
        let data = await db.Role.findOne({
            where: {
                url: role.url,
            },
        });
        return data;
    } catch (error) {
        console.log('>>>Error: ', error);
        return null;
    }
};

const createRoleService = async (roles) => {
    try {
        let existingRoles = await db.Role.findAll({
            where: {
                url: {
                    [Op.in]: roles.map((role) => role.url),
                },
            },
            raw: true,
        });
        console.log('>>>>>>>>>>>existingRoles: ', existingRoles);
        let diffRoles = roles.filter((role) => {
            return !existingRoles.some(
                (existingRole) => existingRole.url === role.url
            );
        });
        console.log('>>>>>>>>>>>diffRoles: ', diffRoles);
        if (diffRoles.length === 0) {
            return {
                message: 'All roles already exist',
                code: 1,
                data: null,
            };
        }
        const data = await db.Role.bulkCreate(diffRoles);
        console.log('>>>>>>>>>>>data: ', data);
        return {
            message: `${diffRoles.length} Role created successfully`,
            code: 0,
            data: data,
        };
    } catch (error) {
        console.log('>>>Error: ', error);
        return {
            message: error.message,
            code: -1,
            data: null,
        };
    }
};

const deleteRoleService = async (id) => {
    try {
        const roleDB = await db.Role.findOne({
            where: {
                id: id,
            },
        });
        if (roleDB) {
            await roleDB.destroy();
            return {
                message: `Role deleted successfully`,
                code: 0,
                data: roleDB,
            };
        } else {
            return {
                message: `Role not found`,
                code: 1,
                data: [],
            };
        }
    } catch (error) {
        console.log('>>>Error: ', error);
        return {
            message: error.message,
            code: -1,
            data: null,
        };
    }
};

const updateRolesService = async (roles) => {
    let existCount = 0;
    try {
        for (let role of roles) {
            const roleDB = await db.Role.findOne({
                where: {
                    id: role.id,
                },
            });

            const roleExist = await checkRoleExist(role);
            if (roleDB && !roleExist) {
                await roleDB.update(role);
            } else {
                existCount++;
            }
        }
        return {
            message: `${
                roles.length - existCount
            } roles updated successfully and ${existCount} roles already exist`,
            code: 0,
            data: [],
        };
    } catch (error) {
        return {
            message: error.message,
            code: -1,
            data: [],
        };
    }
};

const searchRoleService = async (search) => {
    try {
        let data = await db.Role.findAll({
            where: {
                [Op.or]: [
                    {
                        url: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                    {
                        description: {
                            [Op.like]: `%${search}%`,
                        },
                    },
                ],
            },
        });
        return {
            message: `${data.length} roles found`,
            code: 0,
            data: data,
        };
    } catch (error) {
        console.log('>>>Error: ', error);
        return {
            message: error.message,
            code: -1,
            data: [],
        };
    }
};

module.exports = {
    getRolesService,
    createRoleService,
    deleteRoleService,
    updateRolesService,
    searchRoleService,
};
