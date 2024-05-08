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

module.exports = {
    getInvoicesByUser,
};
