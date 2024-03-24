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
const jwt = require("jsonwebtoken");
const { getCharacterAchievements, } = require("../modules/battleNet/getCharacterAchievements");
const { createClient } = require("../databaseClient.js");
router.get("/achievement", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const supabase = createClient({ req, res });
        const { data: { user }, error: userError, } = yield supabase.auth.getUser();
        if (userError) {
            console.log("🚀 ~ userError:", userError);
            return res.sendStatus(400);
        }
        // On load we are going to fetch the last time a timestamp was updated within the last  5 mins
        const currentTime = new Date();
        const fiveMinutesAgo = new Date(currentTime - 5 * 60000);
        var date = new Date(fiveMinutesAgo);
        var formattedDate = date.getUTCFullYear() +
            "-" +
            ("0" + (date.getUTCMonth() + 1)).slice(-2) +
            "-" +
            ("0" + date.getUTCDate()).slice(-2) +
            " " +
            ("0" + date.getUTCHours()).slice(-2) +
            ":" +
            ("0" + date.getUTCMinutes()).slice(-2) +
            ":" +
            ("0" + date.getUTCSeconds()).slice(-2) +
            "." +
            ("00" + date.getUTCMilliseconds()).slice(-3) +
            "+00";
        // Lists the current users followed character's that have achievements older than 5mins
        const { data: getOldAchievementsData, error: getOldAchievementsError } = yield supabase
            .from("achievement_request_timestamp")
            .select(`updated_at, 
			character_id, 
			character!inner (
				id,
				name,
				achievement_points,
				realm_slug,
				follow!inner (
					user_id
				)
			)`)
            .lte("updated_at", formattedDate); //more than 5 mins ago
        console.log("🚀 ~ getOldAchievementsData:", getOldAchievementsData);
        if (getOldAchievementsError) {
            console.log("🚀 ~ getOldAchievementsError:", getOldAchievementsError);
            return res.sendStatus(400);
        }
        // Retrieve the JWT from cookies
        const signedJwt = req.cookies.jwt;
        if (!signedJwt) {
            res.status(401).json({ message: "JWT not found" });
            return;
        }
        // Verify the JWT
        const decodedToken = jwt.verify(signedJwt, "Super_Secret_Password");
        if (!decodedToken.access_token) {
            res.status(401).json({ message: "Invalid access token" });
            return;
        }
        // Format the characters that require updated achievements
        const refetchedAchievementPromises = getOldAchievementsData.map((character) => __awaiter(this, void 0, void 0, function* () {
            const characterData = {
                id: character.character_id,
                name: character.character.name,
                realm_slug: character.character.realm_slug,
            };
            const characterAchievementsResponse = yield getCharacterAchievements(req, res, decodedToken, characterData);
            const characterAchievementsBody = yield characterAchievementsResponse.json();
            // format achievements
            const latestAchievements = characterAchievementsBody.achievements.length > 100
                ? characterAchievementsBody.achievements.slice(-100)
                : characterAchievementsBody.achievements;
            const latestAchievementsWithTimestamp = latestAchievements.filter((achievement) => achievement.completed_timestamp);
            return latestAchievementsWithTimestamp.map((achievement) => {
                return {
                    name: achievement.achievement.name,
                    wow_api_id: achievement.id,
                    completed_timestamp: new Date(achievement.completed_timestamp),
                    character_id: character.character_id,
                };
            });
        }));
        const refetchedAchievements = yield Promise.all(refetchedAchievementPromises);
        // Then insert to Supabase the result of the fetched achievements for each element in array
        const { error: addAchievementsError } = yield supabase
            .from("achievement")
            .upsert(refetchedAchievements.flat(), {
            onConflict: "wow_api_id, character_id",
        });
        if (addAchievementsError) {
            console.log("🚀 ~ addAchievementsError:", addAchievementsError);
            return res.sendStatus(400);
        }
        let { data: characterAchievementData, error: characterAchievementError } = yield supabase
            .from("achievement")
            .select(`
    character_id, 
	name, 
	completed_timestamp,
	wow_api_id,
    character!inner (
		id,
		name,
		achievement_points,
		realm_slug,
		follow!inner (
			user_id
		)
    )
	
  `)
            .eq("character.follow.user_id", user.id)
            .order("completed_timestamp", { ascending: false });
        if (characterAchievementError) {
            return res.sendStatus(400);
        }
        res.json(characterAchievementData);
    });
});
module.exports = { router };
//# sourceMappingURL=character.js.map