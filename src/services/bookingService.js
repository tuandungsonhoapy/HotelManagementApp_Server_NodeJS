import bcrypt from 'bcryptjs';
import db from '../models/index';
import { Op } from 'sequelize';
import { raw } from 'body-parser';

const getRoomByIdService = async (id) => {
    try {
        let data = await db.Room.findOne({
            where: {
                id: id,
            },
            include: {
                model: db.Category,
                attributes: ['id', 'categoryName', 'description'],
            },
        });
        return {
            message: 'Room fetched successfully',
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

const createBookingService = async (data) => {
    try {
        let room = await db.Room.findOne({
            where: {
                id: data.roomId,
            },
        });
        if (!room) {
            return {
                message: 'Room not found',
                code: -1,
                data: [],
            };
        }
        if (room.status === 1) {
            return {
                message: 'Room is not available',
                code: 1,
                data: [],
            };
        }
        let price = 0.3 * room.price;
        console.log('data booking >>>>>>>>>>:', data);
        let invoice = await db.Invoice.create({
            totalAmount: room.price,
            status: 0,
            note: '',
            userId: data.userId,
        });
        let bookingData = {
            checkIn: data.startDate,
            checkOut: data.endDate,
            price: price,
        };
        let booking = await room.addInvoice(invoice, { through: bookingData });
        await room.update({
            status: 1,
        });
        return {
            message: 'Booking created successfully',
            code: 0,
            data: booking,
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
    getRoomByIdService,
    createBookingService,
};
