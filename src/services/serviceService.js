import db from '../models/index';
import { Op } from 'sequelize';
import { raw } from 'body-parser';

const getServicesService = async () => {
    try {
        let data = await db.Service.findAll();
        return {
            message: 'Services fetched successfully',
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

const checkServiceExist = async (service) => {
    try {
        let data = await db.Service.findOne({
            where: {
                serviceName: service.serviceName,
            },
        });
        return data;
    } catch (error) {
        console.log('>>>Error: ', error);
        return null;
    }
};

const createServiceService = async (service) => {
    try {
        let existingService = await db.Service.findOne({
            where: {
                serviceName: service.serviceName,
            },
        });
        if (existingService) {
            return {
                message: 'Service already exist',
                code: 1,
                data: 'serviceName',
            };
        }
        let data = await db.Service.create(service);
        return {
            message: 'Service created successfully',
            code: 0,
            data: data,
        };
    } catch (error) {
        return {
            message: error.message,
            code: -1,
            data: [],
        };
    }
};

const deleteServiceService = async (id) => {
    try {
        let data = await db.Service.destroy({
            where: {
                id: id,
            },
        });
        return {
            message: 'Service deleted successfully',
            code: 0,
            data: data,
        };
    } catch (error) {
        return {
            message: error.message,
            code: -1,
            data: null,
        };
    }
};

const updateServiceService = async (service) => {
    try {
        let data = await db.Service.findOne({
            where: {
                id: service.id,
            },
        });
        if (data) {
            await data.update(service);
            return {
                message: 'Service updated successfully',
                code: 0,
                data: data,
            };
        } else {
            return {
                message: 'Service not found',
                code: 1,
                data: [],
            };
        }
    } catch (error) {
        return {
            message: error.message,
            code: -1,
            data: null,
        };
    }
};

export default {
    getServicesService,
    createServiceService,
    deleteServiceService,
    checkServiceExist,
    updateServiceService,
};
