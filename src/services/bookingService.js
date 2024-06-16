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

const hasBookingBeenCreated = async (invoiceId, roomId) => {
    const booking = await db.Booking.findOne({
        where: {
            invoiceId: invoiceId,
            roomId: roomId,
        },
    });
    // true: booking has been created, false: booking has not been created
    return booking !== null;
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
        let isExist = await isExistBooking(
            data.roomId,
            data.startDate,
            data.endDate
        );
        if (isExist) {
            return {
                message: 'Room is not available',
                code: 1,
                data: [],
            };
        }
        let _startDate = new Date(data.startDate);
        _startDate.setHours(0, 0, 0, 0);

        let _endDate = new Date(data.endDate);
        _endDate.setHours(0, 0, 0, 0);

        // Tính số ngày giữa hai ngày
        let diffInTime = _endDate.getTime() - _startDate.getTime();
        let diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));

        // Tính tổng tiền
        let totalPrice = room.price * diffInDays;
        let price = 0.3 * totalPrice;
        console.log('data booking >>>>>>>>>>:', data);
        const _invoice = await db.Invoice.findOne({
            where: {
                userId: data.userId,
                status: 0,
            },
        });
        if (_invoice) {
            let isBooking = await hasBookingBeenCreated(_invoice.id, room.id);
            if (isBooking) {
                return {
                    message: 'Booking has been created',
                    code: 1,
                    data: [],
                };
            }
            let bookingData = {
                checkIn: data.startDate,
                checkOut: data.endDate,
                price: price,
            };
            let booking = await room.addInvoice(_invoice, {
                through: bookingData,
            });
            _invoice.totalAmount += totalPrice;
            _invoice.payments += totalPrice;
            await _invoice.save();
            return {
                message: 'Booking created successfully',
                code: 0,
                data: booking,
            };
        } else {
            let invoice = await db.Invoice.create({
                totalAmount: totalPrice,
                status: 0,
                note: '',
                userId: data.userId,
                payments: totalPrice,
            });
            let bookingData = {
                checkIn: data.startDate,
                checkOut: data.endDate,
                price: price,
            };
            let booking = await room.addInvoice(invoice, {
                through: bookingData,
            });
            return {
                message: 'Booking created successfully',
                code: 0,
                data: booking,
            };
        }
    } catch (error) {
        console.log('>>>Error: ', error);
        return {
            message: error.message,
            code: -1,
            data: [],
        };
    }
};

const getBookingsByInvoiceService = async (invoiceId) => {
    try {
        console.log('invoiceId >>>>>>>>>:', invoiceId);
        let data = await db.Invoice.findOne({
            where: {
                id: invoiceId,
            },
            include: {
                model: db.Room,
                attributes: ['id', 'roomNumber', 'price'],
                through: { attributes: ['id', 'checkIn', 'checkOut', 'price'] },
            },
        });
        return {
            message: 'Bookings fetched successfully',
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

const blockRoomService = async (data) => {
    try {
        if (data.rooms) {
            for (let room of data.rooms) {
                const roomDB = await db.Room.findOne({
                    where: {
                        id: room.id,
                    },
                });
                if (roomDB) {
                    await roomDB.update({ status: 1 });
                }
            }
        }
        return {
            message: 'Room blocked successfully',
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

const unblockRoomService = async (data) => {
    try {
        if (data.rooms) {
            for (let room of data.rooms) {
                const roomDB = await db.Room.findOne({
                    where: {
                        id: room.id,
                    },
                });
                if (roomDB) {
                    await roomDB.update({ status: 0 });
                }
            }
        }
        return {
            message: 'Room unblocked successfully',
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
const deleteBookingService = async (id) => {
    try {
        let data = await db.Booking.findOne({
            where: {
                id: id,
            },
        });
        let room = await db.Room.findOne({
            where: {
                id: data.roomId,
            },
        });
        let invoice = await db.Invoice.findOne({
            where: {
                id: data.invoiceId,
            },
        });
        let _startDate = new Date(data.checkIn);
        _startDate.setHours(0, 0, 0, 0);

        let _endDate = new Date(data.checkOut);
        _endDate.setHours(0, 0, 0, 0);

        // Tính số ngày giữa hai ngày
        let diffInTime = _endDate.getTime() - _startDate.getTime();
        let diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));

        invoice.totalAmount -= room.price * diffInDays;
        invoice.payments -= room.price * diffInDays;
        if (invoice.totalAmount === 0) {
            await invoice.destroy();
            await data.destroy();
            return {
                message: 'Booking deleted successfully',
                code: 0,
                data: 0,
            };
        } else {
            await invoice.save();
            await data.destroy();
            return {
                message: 'Booking deleted successfully',
                code: 0,
                data: 1,
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

module.exports = {
    getRoomByIdService,
    createBookingService,
    getBookingsByInvoiceService,
    blockRoomService,
    unblockRoomService,
    deleteBookingService,
};
