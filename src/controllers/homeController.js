import db from '../models/index';
import CRUDService from '../services/CRUDService';

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        console.log('---------------------');
        console.log(data);
        console.log('---------------------');
        return res.render('homepage.ejs', {
            data: JSON.stringify(data),
        });
    } catch (error) {
        console.log(error);
    }
};

let getCRUD = async (req, res) => {
    try {
        return res.render('crud.ejs');
    } catch (error) {
        console.log(error);
    }
};

let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    return res.send(message);
};

let getUsers = async (req, res) => {
    let users = await CRUDService.getAllUsers();
    console.log(users);
    return res.send(users);
};

let getEditUser = async (req, res) => {
    console.log(req.query);
    if (req.query.id) {
        let user = await CRUDService.getUser(req.query.id);
        console.log(user);
        return res.render('editUser.ejs', {
            data: user,
        });
    } else {
        return res.send('Error with userId!');
    }
};

let putEditUser = async (req, res) => {
    let data = req.body;
    let users = await CRUDService.updateUser(data);
    return res.render('users', {
        data: users,
    });
};

let deleteUser = async (req, res) => {
    const data = req.query;
    const users = await CRUDService.deleteUser(data);
    return res.render('users', {
        data: users,
    });
};

module.exports = {
    getHomePage,
    getCRUD,
    postCRUD,
    getUsers,
    getEditUser,
    putEditUser,
    deleteUser,
};
