import { log } from "console";
import express from "express";
import {config} from "dotenv"
config({path:"./config/dev.env"})
import { bootstarp } from "./app.controller";
const app = express();
const port = 3000;

bootstarp(app, express);

app.listen(port, () => {
  log("server is running on port", port);
});
