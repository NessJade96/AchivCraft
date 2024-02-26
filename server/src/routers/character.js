const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
	getCharacterAchievements,
} = require("../modules/battleNet/getCharacterAchievements");
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

	const { data: getCharacterIdData, error: getCharacterIdError } =
		await supabase.from("follow").select("*").eq("user_id", user.id);

	console.log("🚀 ~ getCharacterIdData:", getCharacterIdData);

	if (getCharacterIdError) {
		//console.log("🚀 ~ getCharacterError:", getCharacterError);
		return res.sendStatus(400);
	}

	// now I am thinking I need to do a for loop - for each character_id in the array, do a fetch request from wow API of their achievements
	// firstly get it working for the first character_id

	const characterId = getCharacterIdData[0].character_id;
	console.log("🚀 ~ characterId:", characterId);

	const { data: getCharacter, error: getCharacterError } = await supabase
		.from("character")
		.select("*")
		.eq("id", characterId);
	console.log("🚀 ~ getCharacter:", getCharacter);

	if (getCharacterError) {
		//console.log("🚀 ~ getCharacterError:", getCharacterError);
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

	const characterAchievementsResponse = await getCharacterAchievements(
		req,
		res,
		decodedToken,
		getCharacter
	);
	const characterAchievementsJSON =
		await characterAchievementsResponse.json();
	//console.log("🚀 ~ characterAchievementsJSON:", characterAchievementsJSON);

	// now we save the latest achievements to the DB - keys:
	// name
	// wow_api_id
	// completed_timestamp
	// character_id

	const achievement = characterAchievementsJSON.achievements[0];
	console.log("🚀 ~ achievement:", achievement);
	const name = achievement.achievement.name;
	console.log("🚀 ~ name:", name);
	const wowId = achievement.id;
	console.log("🚀 ~ wowId:", wowId);
	const completedTimestamp = achievement.completed_timestamp;
	console.log("🚀 ~ completedTimestamp:", completedTimestamp);
	const date = new Date(achievement.completed_timestamp);
	console.log("🚀 ~ date:", date);

	
	res.json(characterAchievementsJSON);
});

module.exports = { router };
