"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const character_1 = require("./src/routers/character");
const follow_1 = require("./src/routers/follow");
const login_1 = require("./src/routers/login");
const logout_1 = require("./src/routers/logout");
const search_1 = require("./src/routers/search");
const signup_1 = require("./src/routers/signup");
const unfollow_1 = require("./src/routers/unfollow");
const health_1 = require("./src/routers/health");
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL, // Allow requests from this origin
    optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204,
    credentials: true,
}));
app.use(bodyParser.json());
app.use("/api/health", health_1.router);
app.use("/api/character", character_1.router);
app.use("/api/follow", follow_1.router);
app.use("/api/login", login_1.router);
app.use("/api/logout", logout_1.router);
app.use("/api/search", search_1.router);
app.use("/api/signup", signup_1.router);
app.use("/api/unfollow", unfollow_1.router);
app.get("*", (req, res) => {
    res.send("Error 404 Invalid Endpoint");
});
app.use(function (err, req, res) {
    console.error(err);
    return;
});
app.listen(process.env.PORT, () => {
    console.log(`Listening on http://localhost:${process.env.PORT}`);
});
//# sourceMappingURL=index.js.map