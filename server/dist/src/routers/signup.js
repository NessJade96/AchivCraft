"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require("express");
const router = express.Router();
const { supabaseClient } = require("../databaseClient.js");
const jwt = require("jsonwebtoken");
const { getBattleNetToken } = require("../modules/battleNet/getBattleNetToken.js");
router.post("/", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        if (!email || !password) {
            res.sendStatus(401);
            return;
        }
        const { data: { user }, } = yield supabaseClient.auth.signUp({
            email,
            password,
        });
        if (!user) {
            res.sendStatus(401);
            return;
        }
        const battleNetTokenJson = yield getBattleNetToken();
        const signedJwt = jwt.sign({
            access_token: battleNetTokenJson.access_token,
        }, "Super_Secret_Password");
        res.cookie("jwt", signedJwt, {
            httpOnly: true,
            maxAge: 3600000,
            domain: "localhost",
            path: "/",
        }); // maxAge is in milliseconds (1 hour in this case)
        res.json({ success: true });
    });
});
module.exports = { router };
