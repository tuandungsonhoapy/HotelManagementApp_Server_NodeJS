import db from '../models/index';

const getGroupsService = async () => {
    try {
        let groups = await db.Group.findAll({
            attributes: ['id', 'groupName', 'description'],
        });
        if (groups) {
            return {
                message: 'Get group successfully!',
                code: 0,
                data: groups,
            };
        }
        return {
            message: 'Get group successfully!',
            code: 0,
            data: [],
        };
    } catch (error) {
        return {
            message: 'Someting wrongs with service',
            code: -1,
            data: [],
        };
    }
};

module.exports = {
    getGroupsService,
};
