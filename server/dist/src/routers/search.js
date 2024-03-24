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
const router = express_1.default.Router();
exports.router = router;
router.get("/", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const { realmSlug, characterName } = req.query;
        const supabase = (0, databaseClient_1.createClient)({ req, res });
        const capitalizedCharacterName = 
        // @ts-expect-error get deployment working
        characterName.charAt(0).toUpperCase() + characterName.slice(1);
        const { data: checkCharacterData, error: checkCharacterError } = yield supabase
            .from("character")
            .select("*")
            .eq("realm_slug", realmSlug)
            .eq("name", capitalizedCharacterName);
        // @ts-expect-error get deployment working
        let characterDataResponse = checkCharacterData[0];
        if (checkCharacterError) {
            console.log("🚀 ~ checkCharacterError:", checkCharacterError);
            return res.sendStatus(400);
        }
        // If character is found return character data
        if (characterDataResponse) {
            const { data: { user }, error: userError, } = yield supabase.auth.getUser();
            if (userError) {
                console.log("🚀 ~ userError:", userError);
                return res.sendStatus(400);
            }
            const { data: checkFollowing, error: checkFollowingError } = yield supabase
                .from("follow")
                .select("*")
                // @ts-expect-error get deployment working
                .eq("user_id", user.id)
                .eq("character_id", characterDataResponse.id);
            if (checkFollowingError) {
                console.log("🚀 ~ checkFollowingError:", checkFollowingError);
                return res.sendStatus(400);
            }
            const characterOutput = {
                id: characterDataResponse.id,
                name: characterDataResponse.name,
                faction: characterDataResponse.faction,
                race: characterDataResponse.race,
                class: characterDataResponse.class,
                achievementPoints: characterDataResponse.achievement_points,
                realmSlug: characterDataResponse.realm_slug,
                isFollowing: checkFollowing.length > 0,
                followId: (_a = checkFollowing[0]) === null || _a === void 0 ? void 0 : _a.id,
            };
            if (characterOutput.isFollowing) {
                console.log("you are following this character");
            }
            else {
                console.log("you are NOT following this character");
            }
            res.json(characterOutput);
            return;
        }
        // Retrieve the JWT from cookies
        const signedJwt = req.cookies.jwt;
        if (!signedJwt) {
            res.status(401).json({ message: "JWT not found" });
            return;
        }
        // Verify the JWT
        const decodedToken = jsonwebtoken_1.default.verify(signedJwt, "Super_Secret_Password");
        // @ts-expect-error get deployment working
        if (!decodedToken.access_token) {
            res.status(401).json({ message: "Invalid access token" });
            return;
        }
        //GETs the characters info from WOW api
        const characterResponse = yield fetch(`https://us.api.blizzard.com/profile/wow/character/${realmSlug}/${characterName}?namespace=profile-us&locale=en_US`, {
            method: "GET",
            headers: {
                // @ts-expect-error get deployment working
                Authorization: "Bearer " + decodedToken.access_token,
            },
        }).catch((error) => {
            console.error("Error:", error);
            return error;
        });
        if (!characterResponse.ok) {
            throw new Error("Network response was not ok");
        }
        const characterJSON = yield characterResponse.json();
        const character = {
            id: characterJSON.id,
            name: characterJSON.name,
            faction: characterJSON.faction.name,
            race: characterJSON.race.name,
            class: characterJSON.character_class.name,
            achievementPoints: characterJSON.achievement_points,
            realmSlug: characterJSON.realm.slug,
            isFollowing: false,
        };
        console.log("This character is not in the DB and the user is NOT following this character");
        res.json(character);
    });
});
//# sourceMappingURL=search.js.map