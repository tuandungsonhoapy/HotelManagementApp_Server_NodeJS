import express from "express";
import homeController from "../controllers/homeController";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage);
    router.get("/crud", homeController.getCRUD);

    router.post("/post-crud", homeController.postCRUD);
    router.get("/users", homeController.getUsers);
    router.get("/edit-crud", homeController.getEditUser);
    router.post("/put-crud", homeController.putEditUser)

    return app.use("/", router);
};

module.exports = initWebRoutes;
