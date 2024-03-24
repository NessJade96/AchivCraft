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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const databaseClient_1 = require("../databaseClient");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getBattleNetToken_1 = require("../modules/battleNet/getBattleNetToken");
const router = express_1.default.Router();
exports.router = router;
router.post("/", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        if (!email || !password) {
            res.sendStatus(401);
            return;
        }
        const supabase = (0, databaseClient_1.createClient)({ req, res });
        const { data: { user }, } = yield supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (!user) {
            res.sendStatus(401);
            return;
        }
        const battleNetTokenJson = yield (0, getBattleNetToken_1.getBattleNetToken)();
        const signedJwt = jsonwebtoken_1.default.sign({
            access_token: battleNetTokenJson.access_token,
        }, "Super_Secret_Password");
        res.cookie("jwt", signedJwt, {
            httpOnly: true,
            maxAge: 3600000,
            domain: "https://achiv-craft-server.vercel.app",
            path: "/",
        }); // maxAge is in milliseconds (1 hour in this case)
        res.json({ success: true });
    });
});
//# sourceMappingURL=login.js.map