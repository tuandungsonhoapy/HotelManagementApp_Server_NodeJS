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

const isExistBooking = async (roomId, startDate, endDate) => {
    try {
        let data = await db.Room.findOne({
            where: {
                id: roomId,
            },
            include: [
                {
                    model: db.Invoice,
                    through: { model: db.Booking },
                    required: false,
                },
            ],
        });
        if (!data) {
            return {
                message: 'Room not found',
                code: -1,
                data: [],
            };
        }
        let invoices = data.Invoices;
        let isExist = invoices.some((invoice) => {
            if (invoice.status === 0) return false;
            let booking = invoice.Booking;
            // Chuyển đổi startDate và endDate thành đối tượng Date
            let start = new Date(startDate);
            let end = new Date(endDate);

            // Chuyển đổi booking.checkIn và booking.checkOut thành đối tượng Date
            let checkIn = new Date(booking.checkIn);
            let checkOut = new Date(booking.checkOut);

            let currentDate = new Date();
            if (checkOut <= currentDate) {
                return false;
            }

            return (
                (start >= checkIn && start <= checkOut) ||
                (end >= checkIn && end <= checkOut) ||
                (start <= checkIn && end >= checkOut)
            );
        });
        return isExist;
    } catch (error) {
        console.log('>>>Error: ', error);
        return {
            message: error.message,
            code: -1,
            data: [],
        };
    }
};

const getRoomsByOptionService = async (checkIn, checkOut, categoryId) => {
    try {
        let data = await db.Room.findAll({
            where: {
                categoryId: categoryId,
                // status: {
                //     [Op.or]: [0, 2], // status là 0 HOẶC 2
                // },
            },
            include: [
                {
                    model: db.Invoice,
                    through: { model: db.Booking },
                    required: false,
                },
            ],
        });
        let result = [];

        for (let room of data) {
            let isExist = await isExistBooking(room.id, checkIn, checkOut);
            if (!isExist) {
                result.push(room);
            }
        }
        console.log('>>>>>>>>>>>>>>>>>Data empty room: ', result);
        return {
            message: 'Rooms fetched successfully',
            code: 0,
            data: result,
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

// const getRoomsByOptionService = async (checkIn, checkOut, categoryId) => {
//     try {
//         let data = await db.Room.findOne({
//             where: {
//                 id: 24,
//             },
// include: [
//     {
//         model: db.Invoice,
//         through: { model: db.Booking },
//         required: true,
//     },
// ],
//         });
//         return {
//             message: 'Rooms fetched successfully',
//             code: 0,
//             data: data,
//         };
//     } catch (error) {
//         console.log('>>>Error: ', error);
//         return {
//             message: error.message,
//             code: -1,
//             data: [],
//         };
//     }
// };

export default {
    getRoomsService,
    createRoomService,
    deleteRoomService,
    updateRoomService,
    searchRoomService,
    getRoomsByCategoryService,
    getRoomsByOptionService,
};
