import bookingService from '../services/bookingService';

const getRoomById = async (req, res) => {
    try {
        let response = await bookingService.getRoomByIdService(req.params.id);
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

const createBooking = async (req, res) => {
    try {
        let data = { ...req.body, userId: req.user.id };
        let response = await bookingService.createBookingService(data);
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

const getBookingsByInvoice = async (req, res) => {
    try {
        let response = await bookingService.getBookingsByInvoiceService(
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

const blockRoom = async (req, res) => {
    try {
        let rooms = req.body;
        let data = { rooms, userId: req.user.id };
        console.log('data block room >>>>>>>>>:', data);
        let response = await bookingService.blockRoomService(data);
        return res.status(200).json({
            message: response.message,
            code: response.code,
            data: response.data,
            status: 200,
        });
        // return res.status(200).json({
        //     message: '',
        //     code: '',
        //     data: '',
        //     status: 200,
        // });
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

const unblockRoom = async (req, res) => {
    try {
        let rooms = req.body;
        let data = { rooms, userId: req.user.id };
        let response = await bookingService.unblockRoomService(data);
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

const deleteBooking = async (req, res) => {
    try {
        let response = await bookingService.deleteBookingService(req.body.id);
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
    getRoomById,
    createBooking,
    getBookingsByInvoice,
    blockRoom,
    unblockRoom,
    deleteBooking,
};
