import { where } from 'sequelize';
import db from '../models/index';

const getGroupWithRoles = async (user) => {
    let roles = await db.Group.findOne({
        where: { id: user.groupId },
        attributes: ['id', 'groupName', 'description'],
        include: {
            model: db.Role,
            attributes: ['id', 'url', 'description'],
            through: { attributes: [] },
        },
    });
    console.log(roles);
    return roles ? roles : {};
};

module.exports = {
    getGroupWithRoles,
};
