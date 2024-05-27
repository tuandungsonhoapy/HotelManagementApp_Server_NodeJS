import invoiceSerivce from '../services/invoiceService';

const getInvoicesByUser = async (req, res) => {
    try {
        let response = await invoiceSerivce.getInvoicesByUserService(
            req.user.id
        );
        return res.status(200).json({
            message: response.message,
            code: response.code,
            data: response.data,
            status: 200,
        });
    } catch (error) {
        console.log('>>>Error: ', error);
        return res.status(500).json({
            message: error.message,
            code: error.code,
            data: error.data,
            status: 500,
        });
    }
};

const getQuantityInvoicesByUser = async (req, res) => {
    try {
        let response = await invoiceSerivce.getQuantityInvoicesByUserService(
            req.user.id
        );
        return res.status(200).json({
            message: response.message,
            code: response.code,
            data: response.data,
            status: 200,
        });
    } catch (error) {
        console.log('>>>Error: ', error);
        return res.status(500).json({
            message: error.message,
            code: error.code,
            data: error.data,
            status: 500,
        });
    }
};

const payDeposit = async (req, res) => {
    try {
        let response = await invoiceSerivce.payDepositService(req.body);
        return res.status(200).json({
            message: response.message,
            code: response.code,
            data: response.data,
            status: 200,
        });
    } catch (error) {
        console.log('>>>Error: ', error);
        return res.status(500).json({
            message: error.message,
            code: error.code,
            data: error.data,
            status: 500,
        });
    }
};

const getInvoices = async (req, res) => {
    try {
        let response = await invoiceSerivce.getInvoicesService();
        return res.status(200).json({
            message: response.message,
            code: response.code,
            data: response.data,
            status: 200,
        });
    } catch (error) {
        console.log('>>>Error: ', error);
        return res.status(500).json({
            message: error.message,
            code: error.code,
            data: error.data,
            status: 500,
        });
    }
};

const payInvoice = async (req, res) => {
    try {
        let response = await invoiceSerivce.payInvoiceService(req.body);
        return res.status(200).json({
            message: response.message,
            code: response.code,
            data: response.data,
            status: 200,
        });
    } catch (error) {
        console.log('>>>Error: ', error);
        return res.status(500).json({
            message: error.message,
            code: error.code,
            data: error.data,
            status: 500,
        });
    }
};

const confirmPayDeposit = async (req, res) => {
    try {
        let response = await invoiceSerivce.confirmPayDepositService(req.body);
        return res.status(200).json({
            message: response.message,
            code: response.code,
            data: response.data,
            status: 200,
        });
    } catch (error) {
        console.log('>>>Error: ', error);
        return res.status(500).json({
            message: error.message,
            code: error.code,
            data: error.data,
            status: 500,
        });
    }
};

const rejectPayDeposit = async (req, res) => {
    try {
        let response = await invoiceSerivce.rejectPayDepositService(req.body);
        return res.status(200).json({
            message: response.message,
            code: response.code,
            data: response.data,
            status: 200,
        });
    } catch (error) {
        console.log('>>>Error: ', error);
        return res.status(500).json({
            message: error.message,
            code: error.code,
            data: error.data,
            status: 500,
        });
    }
};

const checkInvoice = async (req, res) => {
    try {
        let response = await invoiceSerivce.checkInvoiceService(
            req.query.invoiceId
        );
        return res.status(200).json({
            message: response.message,
            code: response.code,
            data: response.data,
            status: 200,
        });
    } catch (error) {
        console.log('>>>Error: ', error);
        return res.status(500).json({
            message: error.message,
            code: error.code,
            data: error.data,
            status: 500,
        });
    }
};

module.exports = {
    getInvoicesByUser,
    getQuantityInvoicesByUser,
    payDeposit,
    getInvoices,
    payInvoice,
    confirmPayDeposit,
    rejectPayDeposit,
    checkInvoice,
};
