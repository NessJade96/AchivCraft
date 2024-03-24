"use strict";
var __awaiter =
	(this && this.__awaiter) ||
	function (thisArg, _arguments, P, generator) {
		function adopt(value) {
			return value instanceof P
				? value
				: new P(function (resolve) {
						resolve(value);
					});
		}
		return new (P || (P = Promise))(function (resolve, reject) {
			function fulfilled(value) {
				try {
					step(generator.next(value));
				} catch (e) {
					reject(e);
				}
			}
			function rejected(value) {
				try {
					step(generator["throw"](value));
				} catch (e) {
					reject(e);
				}
			}
			function step(result) {
				result.done
					? resolve(result.value)
					: adopt(result.value).then(fulfilled, rejected);
			}
			step(
				(generator = generator.apply(thisArg, _arguments || [])).next()
			);
		});
	};
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const getCharacterAchievements_1 = require("../modules/battleNet/getCharacterAchievements");
const databaseClient_js_1 = require("../databaseClient");
const router = express_1.default.Router();
exports.router = router;
router.post("/", function (req, res) {
	return __awaiter(this, void 0, void 0, function* () {
		var _a;
		const supabase = (0, databaseClient_js_1.createClient)({ req, res });
		const {
			data: { user },
			error: userError,
		} = yield supabase.auth.getUser();
		if (userError) {
			console.log("🚀 ~ userError:", userError);
			return res.sendStatus(400);
		}
		const {
			characterName,
			characterfaction,
			characterRace,
			characterClass,
			characterAchievementPoints,
			characterRealmSlug,
		} = req.body;
		if (
			!characterName ||
			!characterfaction ||
			!characterRace ||
			!characterClass ||
			!characterAchievementPoints ||
			!characterRealmSlug
		) {
			res.sendStatus(401);
			return;
		}
		const { data: checkCharacterData, error: checkCharacterError } =
			yield supabase
				.from("character")
				.select("id, name, realm_slug")
				.eq("name", characterName)
				.eq("realm_slug", characterRealmSlug);
		if (checkCharacterError) {
			return res.sendStatus(400);
		}
		let characterId =
			(_a = checkCharacterData[0]) === null || _a === void 0
				? void 0
				: _a.id;
		if (!characterId) {
			const { data: characterData, error: characterError } =
				yield supabase
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
			// @ts-expect-error get deployment working
			characterId = characterData[0].id;
			// Get all the achievements from wow api based on characterName and realmSlug
			// Retrieve the JWT from cookies
			const signedJwt = req.cookies.jwt;
			if (!signedJwt) {
				res.status(401).json({ message: "JWT not found" });
				return;
			}
			// Verify the JWT
			const decodedToken = jsonwebtoken_1.default.verify(
				signedJwt,
				"Super_Secret_Password"
			);
			// @ts-expect-error get deployment working
			if (!decodedToken.access_token) {
				res.status(401).json({ message: "Invalid access token" });
				return;
			}
			const characterAchievementsResponse = yield (0,
			getCharacterAchievements_1.getCharacterAchievements)(
				req,
				res,
				decodedToken,
				characterData
			);
			const characterAchievementsJSON =
				yield characterAchievementsResponse.json();
			// Loop through all achievements to format them so they are ready to be inserted into the DB
			const latestAchievements =
				characterAchievementsJSON.achievements.length > 100
					? characterAchievementsJSON.achievements.slice(-100)
					: characterAchievementsJSON.achievements;
			console.log("🚀 ~ latestAchievements:", latestAchievements);
			const latestAchievementWithTimestamp = latestAchievements.filter(
				// @ts-expect-error get deployment working
				(achievement) => achievement.completed_timestamp
			);
			const achievementRows = latestAchievementWithTimestamp.map(
				// @ts-expect-error get deployment working
				(achievement) => {
					return {
						name: achievement.achievement.name,
						wow_api_id: achievement.id,
						completed_timestamp: new Date(
							achievement.completed_timestamp
						),
						character_id: characterId,
					};
				}
			);
			// Then insert to Supabase the result of the fetch achievements
			const { error: addAchievementsError } = yield supabase
				.from("achievement")
				.insert(achievementRows);
			if (addAchievementsError) {
				return res.sendStatus(400);
			}
		}
		const newFollow = {
			// @ts-expect-error get deployment working
			user_id: user.id,
			character_id: characterId,
		};
		const { data: followData, error: followError } = yield supabase
			.from("follow")
			.insert(newFollow)
			.select("id");
		// @ts-expect-error get deployment working
		const followID = followData[0].id;
		if (followError) {
			return res.sendStatus(400);
		}
		res.json({ success: true, followID });
	});
});
//# sourceMappingURL=follow.js.map
