"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstarp = bootstarp;
const auth_controller_1 = __importDefault(require("./module/auth/auth.controller"));
const connection_1 = require("./DB/connection");
function bootstarp(app, express) {
    (0, connection_1.connectDB)();
    app.use(express.json());
    //auth
    app.use("/auth", auth_controller_1.default);
    //user
    //posts
    //coments
    //messages
    app.use("/{*dummy}", (req, res, next) => {
        return res.status(404).json({ message: "invalid router", success: false });
    });
}
