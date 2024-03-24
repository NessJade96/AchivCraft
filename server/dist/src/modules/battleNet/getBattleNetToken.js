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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBattleNetToken = void 0;
const credentials = btoa(process.env.BNET_OAUTH_CLIENT_ID +
    ":" +
    process.env.BNET_OAUTH_CLIENT_SECRET);
const formData = new URLSearchParams();
formData.append("grant_type", "client_credentials");
function getBattleNetToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const battleNetTokenResponse = yield fetch("https://us.battle.net/oauth/token", {
            method: "POST",
            body: formData,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Basic " + credentials,
            },
        }).catch((error) => {
            console.error("Error:", error);
            return error;
        });
        if (!battleNetTokenResponse.ok) {
            throw new Error("Network response was not ok");
        }
        const battleNetTokenJson = yield battleNetTokenResponse.json();
        return battleNetTokenJson;
    });
}
exports.getBattleNetToken = getBattleNetToken;
//# sourceMappingURL=getBattleNetToken.js.map