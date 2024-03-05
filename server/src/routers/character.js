const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
// const {
// 	getCharacterAchievements,
// } = require("../modules/battleNet/getCharacterAchievements");
const { createClient } = require("../databaseClient.js");

router.get("/achievement", async function (req, res) {
	const supabase = createClient({ req, res });
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError) {
		console.log("🚀 ~ userError:", userError);
		return res.sendStatus(400);
	}

	// On load we are going to fetch the last time a timestamp was
	// updated in range of last 5 mins from SUPABASE
	const currentTime = new Date();
	const fiveMinutesAgo = new Date(currentTime - 5 * 60000);
	var date = new Date(fiveMinutesAgo);
	var formattedDate =
		date.getUTCFullYear() +
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

	// Lists the users followed character's that have achievements older than 5mins
	const { data: getOldAchievementsData, error: getOldAchievementsError } =
		await supabase
			.from("achievement_request_timestamp")
			.select(
				`updated_at, 
			character_id, 
			character!inner (
				id,
				name,
				achievement_points,
				realm_slug,
				follow!inner (
					user_id
				)
			)`
			)
			.lte("updated_at", formattedDate); //more than 5 mins ago
	console.log("🚀 ~ getOldAchievementsData:", getOldAchievementsData);

	if (getOldAchievementsError) {
		console.log("🚀 ~ getOldAchievementsError:", getOldAchievementsError);
		return res.sendStatus(400);
	}

	let { data: characterAchievementData, error: characterAchievementError } =
		await supabase
			.from("achievement")
			.select(
				`
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
	
  `
			)
			.eq("character.follow.user_id", user.id)
			.order("completed_timestamp", { ascending: false });

	if (characterAchievementError) {
		return res.sendStatus(400);
	}
	//const characterId = getCharacterIdData[0].character_id;
	//console.log("🚀 ~ characterId:", characterId);

	// const { data: getCharacter, error: getCharacterError } = await supabase
	// 	.from("character")
	// 	.select("*")
	// 	.eq("id", characterId);
	// console.log("🚀 ~ getCharacter:", getCharacter);

	// if (getCharacterError) {
	// 	//console.log("🚀 ~ getCharacterError:", getCharacterError);
	// 	return res.sendStatus(400);
	// }

	res.json(characterAchievementData);
});

module.exports = { router };
