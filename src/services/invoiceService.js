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

module.exports = {
    getInvoicesByUserService,
};
