import db from "../models/index";
import CRUDService from "../services/CRUDService";

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        console.log("---------------------");
        console.log(data);
        console.log("---------------------");
        return res.render("homepage.ejs", {
            data: JSON.stringify(data),
        });
    } catch (error) {
        console.log(error);
    }
};

let getCRUD = async (req, res) => {
    try {
        return res.render("crud.ejs");
    } catch (error) {
        console.log(error);
    }
};

let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    return res.send(message);
};

module.exports = {
    getHomePage,
    getCRUD,
    postCRUD,
};
