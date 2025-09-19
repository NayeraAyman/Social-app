"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstarp = bootstarp;
const DB_1 = require("./DB");
const module_1 = require("./module");
function bootstarp(app, express) {
    (0, DB_1.connectDB)();
    app.use(express.json());
    //auth
    app.use("/auth", module_1.authRouter);
    app.use("/user", module_1.userRouter);
    //user
    //posts
    //coments
    //messages
    app.use("/{*dummy}", (req, res, next) => {
        return res.status(404).json({ message: "invalid router", success: false });
    });
    app.use((error, req, res, next) => {
        return res.status(error.stausCode).json({
            message: error.message,
            success: false,
            errorDetails: error.errorDetails,
        });
    });
}
