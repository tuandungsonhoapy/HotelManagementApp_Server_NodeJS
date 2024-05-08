import bcrypt from 'bcryptjs';
import db from '../models/index';
import { Op } from 'sequelize';
import { raw } from 'body-parser';

const getRoomsService = async () => {
    try {
        let data = await db.Room.findAll({
            include: {
                model: db.Category,
                attributes: ['id', 'categoryName', 'description'],
            },
        });
        return {
            message: 'Rooms fetched successfully',
            code: 'GET_ROOMS_SUCCESS',
            data: data,
        };
    } catch (error) {
        console.log('>>>Error: ', error);
        return {
            message: error.message,
            code: 'GET_ROOMS_ERROR',
            data: [],
        };
    }
};

const checkRoomExist = async (room) => {
    try {
        let data = await db.Room.findOne({
            where: {
                roomNumber: room.roomNumber,
            },
        });
        return data;
    } catch (error) {
        console.log('>>>Error: ', error);
        return null;
    }
};

const createRoomService = async (room) => {
    try {
        let existingRoom = await db.Room.findOne({
            where: {
                roomNumber: room.roomNumber,
            },
        });
        if (existingRoom) {
            return {
                message: 'Room already exist',
                code: 1,
                data: 'roomNumber',
            };
        }
        let data = await db.Room.create(room);
        return {
            message: 'Room created successfully',
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

const deleteRoomService = async (id) => {
    try {
        let data = await db.Room.destroy({
            where: {
                id: id,
            },
        });
        return {
            message: 'Room deleted successfully',
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

const updateRoomService = async (room) => {
    try {
        let data = await db.Room.update(room, {
            where: {
                id: room.id,
            },
        });
        return {
            message: 'Room updated successfully',
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

const searchRoomService = async (room) => {
    try {
        let data = await db.Room.findAll({
            where: {
                roomNumber: {
                    [Op.like]: `%${room.roomNumber}%`,
                },
            },
        });
        return {
            message: 'Room searched successfully',
            code: 'SEARCH_ROOM_SUCCESS',
            data: data,
        };
    } catch (error) {
        console.log('>>>Error: ', error);
        return {
            message: error.message,
            code: 'SEARCH_ROOM_ERROR',
            data: null,
        };
    }
};

const getRoomsByCategoryService = async (categoryId) => {
    try {
        let data = await db.Room.findAll({
            where: {
                categoryId: categoryId,
                status: 0,
            },
            include: {
                model: db.Category,
                attributes: ['id', 'categoryName', 'description'],
            },
        });
        return {
            message: 'Rooms fetched successfully',
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

export default {
    getRoomsService,
    createRoomService,
    deleteRoomService,
    updateRoomService,
    searchRoomService,
    getRoomsByCategoryService,
};
