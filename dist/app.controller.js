"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstarp = bootstarp;
const DB_1 = require("./DB");
const error_1 = require("./utils/error");
const module_1 = require("./module");
function bootstarp(app, express) {
    (0, DB_1.connectDB)();
    app.use(express.json());
    //auth
    app.use("/auth", module_1.authRouter);
    //user
    app.use("/user", module_1.userRouter);
    //posts
    app.use("/post", module_1.postRouter);
    //coments
    //messages
    app.use("/{*dummy}", (req, res, next) => {
        return res.status(404).json({ message: "invalid router", success: false });
    });
    //global error handler
    app.use((error, req, res, next) => {
        const statusCode = error instanceof error_1.AppError && error.statusCode ? error.statusCode : 500;
        return res.status(statusCode).json({
            message: error.message || "Internal Server Error",
            success: false,
            errorDetails: error.errorDetails || null,
        });
    });
}
