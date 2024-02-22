const express = require("express");
const router = express.Router();
const { createClient } = require("../databaseClient.js");

router.post("/", async function (req, res) {
	const supabase = createClient({ req, res });

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
		await supabase
			.from("character")
			.select("id, name, realm_slug")
			.eq("name", characterName)
			.eq("realm_slug", characterRealmSlug);

	if (checkCharacterError) {
		return res.sendStatus(400);
	}
	let characterId = checkCharacterData[0]?.id;

	if (!characterId) {
		const { data: characterData, error: characterError } = await supabase
			.from("character")
			.insert({
				name: characterName,
				faction: characterfaction,
				race: characterRace,
				class: characterClass,
				achievement_points: characterAchievementPoints,
				realm_slug: characterRealmSlug,
			})
			.select("id, name, realm_slug");

		if (characterError) {
			return res.sendStatus(400);
		}
		characterId = characterData[0].id;
	}

	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError) {
		console.log("🚀 ~ userError:", userError);
		return res.sendStatus(400);
	}

	const newFollow = {
		user_id: user.id,
		character_id: characterId,
	};

	const { data: followData, error: followError } = await supabase
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

module.exports = { router };
