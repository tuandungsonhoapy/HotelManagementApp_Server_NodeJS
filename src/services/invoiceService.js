import bcrypt from 'bcryptjs';
import db from '../models/index';
import { Op } from 'sequelize';
import { raw } from 'body-parser';

const getInvoicesByUserService = async (userId) => {
    try {
        let data = await db.Invoice.findAll({
            where: {
                userId: userId,
            },
        });
        return {
            message: 'Invoices fetched successfully',
            code: 0,
            data: data,
        };
    } catch (error) {
        console.log('>>>Error: ', error);
        return {
            message: error.message,
            code: 'GET_INVOICES_ERROR',
            data: [],
        };
    }
};

const checkInvoiceStatus = (invoices) => {
    return invoices.some(
        (invoice) => invoice.status === -1 || invoice.status === 0
    );
};

const getQuantityInvoicesByUserService = async (userId) => {
    try {
        let invoices = await db.Invoice.findAll({
            where: {
                userId: userId,
                status: {
                    [Op.or]: [0],
                },
            },
        });
        if (!invoices.length) {
            return {
                message: 'No invoices found',
                code: 0,
                data: {
                    length: 0,
                    check: false,
                },
            };
        }
        return {
            message: 'Invoices fetched successfully',
            code: 0,
            data: {
                length: invoices.length,
                check: true,
            },
        };
    } catch (error) {
        console.log('>>>Error: ', error);
        return {
            message: error.message,
            code: -1,
            data: 0,
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

const payDepositService = async (data) => {
    try {
        const invoice = await db.Invoice.findOne({
            where: { id: data.invoiceId },
            include: [
                {
                    model: db.Room,
                    through: { model: db.Booking },
                    required: false,
                },
            ],
        });
        if (invoice) {
            const rooms = invoice.Rooms;
            for (let room of rooms) {
                let booking = room.Booking;
                let isExist = await isExistBooking(
                    room.id,
                    booking.checkIn,
                    booking.checkOut
                );
                if (isExist || room.status === 1) {
                    return {
                        message: `Room number ${room.roomNumber} has been booked`,
                        code: 1,
                        data: room,
                    };
                }
            }
        }
        let newPrice = invoice.totalAmount - data.price;
        if (newPrice < 0) {
            return {
                message: 'Price is invalid',
                code: -1,
                data: '',
            };
        }
        invoice.payments = newPrice;
        invoice.status = 1;
        await invoice.save();

        // if (invoice) {
        //     const rooms = invoice.Rooms;
        //     for (let room of rooms) {
        //         room.status = 2;
        //         await room.save();
        //     }
        // }
        return {
            message: 'Deposit paid successfully',
            code: 0,
            data: invoice,
        };
    } catch (error) {
        console.log('>>>Error: ', error);
        return {
            message: error.message,
            code: -1,
            data: '',
        };
    }
};

const getInvoicesService = async () => {
    try {
        let data = await db.Invoice.findAll({
            order: [['createdAt', 'DESC']],
        });
        return {
            message: 'Invoices fetched successfully',
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

const payInvoiceService = async (data) => {
    try {
        const invoice = await db.Invoice.findOne({
            where: { id: data.invoiceId },
            include: [
                {
                    model: db.Room,
                    through: { model: db.Booking },
                    required: true,
                },
            ],
        });
        invoice.status = 3;
        invoice.payments = 0;
        await invoice.save();
        // if (invoice) {
        //     const rooms = invoice.Rooms;
        //     for (let room of rooms) {
        //         room.status = 0;
        //         await room.save();
        //     }
        // }
        return {
            message: 'Invoice paid successfully',
            code: 0,
            data: invoice,
        };
    } catch (error) {
        console.log('>>>Error: ', error);
        return {
            message: error.message,
            code: -1,
            data: '',
        };
    }
};

const confirmPayDepositService = async (data) => {
    try {
        const invoice = await db.Invoice.findOne({
            where: { id: data.invoiceId },
            include: [
                {
                    model: db.Room,
                    through: { model: db.Booking },
                    required: true,
                },
            ],
        });
        invoice.status = 2;
        await invoice.save();
        if (invoice) {
            const rooms = invoice.Rooms;
            for (let room of rooms) {
                room.status = 0;
                await room.save();
            }
        }
        return {
            message: 'Deposit paid successfully',
            code: 0,
            data: invoice,
        };
    } catch (error) {
        console.log('>>>Error: ', error);
        return {
            message: error.message,
            code: -1,
            data: '',
        };
    }
};

const rejectPayDepositService = async (data) => {
    try {
        const invoice = await db.Invoice.findOne({
            where: { id: data.invoiceId },
            include: [
                {
                    model: db.Room,
                    through: { model: db.Booking },
                    required: true,
                },
            ],
        });
        invoice.status = -1;
        await invoice.save();
        if (invoice) {
            const rooms = invoice.Rooms;
            for (let room of rooms) {
                room.status = 0;
                await room.save();
            }
        }
        return {
            message: 'Reject invoice successfully',
            code: 0,
            data: invoice,
        };
    } catch (error) {
        console.log('>>>Error: ', error);
        return {
            message: error.message,
            code: -1,
            data: '',
        };
    }
};

const checkInvoiceService = async (invoiceId) => {
    try {
        const invoice = await db.Invoice.findOne({
            where: { id: invoiceId },
            include: [
                {
                    model: db.Room,
                    through: { model: db.Booking },
                    required: true,
                },
            ],
        });
        if (invoice) {
            const roomListHasBeenBooked = invoice.Rooms.filter(
                (room) => room.status === 1
            );
            if (roomListHasBeenBooked.length > 0) {
                return {
                    message: `Danh sách các phòng đang trong quá trình thanh toán:
                    ${roomListHasBeenBooked.map((room) => room.roomNumber)}`,
                    code: 1,
                    data: roomListHasBeenBooked,
                };
            } else {
                for (let room of invoice.Rooms) {
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

            // Now updatedRooms is an array of rooms with status 1
            // You can now update these rooms in your database
        }
        return {
            message: 'OK',
            code: 0,
            data: invoice,
        };
    } catch (error) {
        console.log('>>>Error: ', error);
        return {
            message: error.message,
            code: -1,
            data: '',
        };
    }
};

module.exports = {
    getInvoicesByUserService,
    getQuantityInvoicesByUserService,
    payDepositService,
    getInvoicesService,
    payInvoiceService,
    confirmPayDepositService,
    rejectPayDepositService,
    checkInvoiceService,
};
