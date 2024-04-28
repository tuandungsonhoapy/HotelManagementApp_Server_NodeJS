import { where } from 'sequelize';
import db from '../models/index';

const getGroupWithRoles = async (groupId) => {
    let roles = await db.Group.findOne({
        where: { id: groupId },
        attributes: ['id', 'groupName', 'description'],
        include: {
            model: db.Role,
            attributes: ['id', 'url', 'description'],
            through: { attributes: [] },
        },
    });
    return roles ? roles : {};
};

module.exports = {
    getGroupWithRoles,
};
