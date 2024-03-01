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

	// const { data: getCharacterIdData, error: getCharacterIdError } =
	// 	await supabase.from("follow").select("*").eq("user_id", user.id);

	// console.log("🚀 ~ getCharacterIdData:", getCharacterIdData);

	// if (getCharacterIdError) {
	// 	//console.log("🚀 ~ getCharacterError:", getCharacterError);
	// 	return res.sendStatus(400);
	// }

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

	console.log("🚀 ~ testError:", characterAchievementError);
	console.log("🚀 ~ characterAchievementData:", characterAchievementData);


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
