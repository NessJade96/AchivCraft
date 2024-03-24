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
const router = express_1.default.Router();
exports.router = router;
router.post("/", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const supabase = (0, databaseClient_1.createClient)({ req, res });
        const { followId } = req.body;
        if (!followId) {
            res.sendStatus(401);
            return;
        }
        const { data: { user }, error: userError, } = yield supabase.auth.getUser();
        if (userError) {
            console.log("🚀 ~ userError:", userError);
            return res.sendStatus(400);
        }
        const { error: unfollowError } = yield supabase
            .from("follow")
            .delete()
            .eq("id", followId)
            // @ts-expect-error get deployment working
            .eq("user_id", user.id);
        if (unfollowError) {
            console.log("🚀 ~ unFollowError:", unfollowError);
            return res.sendStatus(400);
        }
        console.log("unfollowed");
        res.json({ success: true });
    });
});
//# sourceMappingURL=unfollow.js.map