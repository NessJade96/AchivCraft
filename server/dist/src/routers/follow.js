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
router.post("/", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const supabase = createClient({ req, res });
        const { data: { user }, error: userError, } = yield supabase.auth.getUser();
        if (userError) {
            console.log("🚀 ~ userError:", userError);
            return res.sendStatus(400);
        }
        const { characterName, characterfaction, characterRace, characterClass, characterAchievementPoints, characterRealmSlug, } = req.body;
        if (!characterName ||
            !characterfaction ||
            !characterRace ||
            !characterClass ||
            !characterAchievementPoints ||
            !characterRealmSlug) {
            res.sendStatus(401);
            return;
        }
        const { data: checkCharacterData, error: checkCharacterError } = yield supabase
            .from("character")
            .select("id, name, realm_slug")
            .eq("name", characterName)
            .eq("realm_slug", characterRealmSlug);
        if (checkCharacterError) {
            return res.sendStatus(400);
        }
        let characterId = (_a = checkCharacterData[0]) === null || _a === void 0 ? void 0 : _a.id;
        if (!characterId) {
            const { data: characterData, error: characterError } = yield supabase
                .from("character")
                .insert({
                name: characterName,
                faction: characterfaction,
                race: characterRace,
                class: characterClass,
                achievement_points: characterAchievementPoints,
                realm_slug: characterRealmSlug,
            })
                .select("id, name, realm_slug")
                .single();
            if (characterError) {
                return res.sendStatus(400);
            }
            characterId = characterData[0].id;
            // Get all the achievements from wow api based on characterName and realmSlug
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
            const characterAchievementsResponse = yield getCharacterAchievements(req, res, decodedToken, characterData);
            const characterAchievementsJSON = yield characterAchievementsResponse.json();
            // Loop through all achievements to format them so they are ready to be inserted into the DB
            const latestAchievements = characterAchievementsJSON.achievements.length > 100
                ? characterAchievementsJSON.achievements.slice(-100)
                : characterAchievementsJSON.achievements;
            console.log("🚀 ~ latestAchievements:", latestAchievements);
            const latestAchievementWithTimestamp = latestAchievements.filter((achievement) => achievement.completed_timestamp);
            const achievementRows = latestAchievementWithTimestamp.map((achievement) => {
                return {
                    name: achievement.achievement.name,
                    wow_api_id: achievement.id,
                    completed_timestamp: new Date(achievement.completed_timestamp),
                    character_id: characterId,
                };
            });
            // Then insert to Supabase the result of the fetch achievements
            const { error: addAchievementsError } = yield supabase
                .from("achievement")
                .insert(achievementRows);
            if (addAchievementsError) {
                return res.sendStatus(400);
            }
        }
        const newFollow = {
            user_id: user.id,
            character_id: characterId,
        };
        const { data: followData, error: followError } = yield supabase
            .from("follow")
            .insert(newFollow)
            .select("id");
        const followID = followData[0].id;
        console.log("🚀 ~ followID:", followID);
        if (followError) {
            return res.sendStatus(400);
        }
        res.json({ success: true, followID });
    });
});
module.exports = { router };
