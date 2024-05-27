import roomService from '../services/roomService';

const getRooms = async (req, res) => {
    try {
        let response = await roomService.getRoomsService();
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

const createRoom = async (req, res) => {
    try {
        let response = await roomService.createRoomService(req.body);
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

const deleteRoom = async (req, res) => {
    try {
        let response = await roomService.deleteRoomService(req.body.id);
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

const updateRoom = async (req, res) => {
    try {
        let response = await roomService.updateRoomService(req.body);
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

const searchRoom = async (req, res) => {
    try {
        let response = await roomService.searchRoomService(req.query);
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

const getRoomsByCategory = async (req, res) => {
    try {
        let response = await roomService.getRoomsByCategoryService(
            req.query.categoryId
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

const getRoomsByOption = async (req, res) => {
    try {
        let response = await roomService.getRoomsByOptionService(
            req.query.checkIn,
            req.query.checkOut,
            req.query.categoryId
        );
        console.log(
            '>>>>>>>>>>>>>>>>..',
            req.query.checkIn,
            req.query.checkOut,
            req.query.categoryId
        );
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

export default {
    getRooms,
    createRoom,
    deleteRoom,
    updateRoom,
    searchRoom,
    getRoomsByCategory,
    getRoomsByOption,
};
