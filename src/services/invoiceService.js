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
                    [Op.or]: [0, 1],
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

const payDepositService = async (data) => {
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
        let newPrice = invoice.totalAmount - data.price;
        if (newPrice < 0) {
            return {
                message: 'Price is invalid',
                code: -1,
                data: '',
            };
        }
        invoice.totalAmount = newPrice;
        invoice.status = 1;
        await invoice.save();

        if (invoice) {
            const rooms = invoice.Rooms;
            for (let room of rooms) {
                room.status = 1;
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

module.exports = {
    getInvoicesByUserService,
    getQuantityInvoicesByUserService,
    payDepositService,
};
