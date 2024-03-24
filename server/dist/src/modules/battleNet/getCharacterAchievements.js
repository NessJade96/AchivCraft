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
exports.getCharacterAchievements = void 0;
const databaseClient_1 = require("../../databaseClient");
// @ts-expect-error get deployment working
function getCharacterAchievements(req, res, decodedToken, getCharacter) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("🚀 ~ getCharacterAchievements ~ getCharacter:", getCharacter);
        const supabase = (0, databaseClient_1.createClient)({ req, res });
        const { data: { user }, error: userError, } = yield supabase.auth.getUser();
        if (userError) {
            console.log("🚀 ~ userError:", userError);
            return res.sendStatus(400);
        }
        // Then insert to Supabase the achievement request timestamp
        const { error: addAchievementRequestTimestampError } = yield supabase
            .from("achievement_request_timestamp")
            .upsert([
            {
                character_id: getCharacter.id,
                updated_at: new Date(),
            },
        ])
            .eq("character_id", getCharacter.id);
        if (addAchievementRequestTimestampError) {
            return res.sendStatus(400);
        }
        let characterName = getCharacter.name;
        const realmSlug = getCharacter.realm_slug;
        characterName =
            characterName.charAt(0).toLowerCase() + characterName.slice(1);
        const decodedJWTToken = decodedToken;
        const characterAchievementsResponse = yield fetch(`https://us.api.blizzard.com/profile/wow/character/${realmSlug}/${characterName}/achievements?namespace=profile-us&locale=en_US&_page=1&_pageSize=10`, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + decodedJWTToken.access_token,
            },
        }).catch((error) => {
            console.error("Error:", error);
            return error;
        });
        if (!characterAchievementsResponse.ok) {
            throw new Error("Network response was not ok");
        }
        return characterAchievementsResponse;
    });
}
exports.getCharacterAchievements = getCharacterAchievements;
//# sourceMappingURL=getCharacterAchievements.js.map