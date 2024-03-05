const { createClient } = require("../../databaseClient.js");

async function getCharacterAchievements(req, res, decodedToken, getCharacter) {
	const supabase = createClient({ req, res });
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError) {
		console.log("🚀 ~ userError:", userError);
		return res.sendStatus(400);
	}

	// Then insert to Supabase the achievement request timestamp
	const { error: addAchievementRequestTimestampError } = await supabase
		.from("achievement_request_timestamp")
		.insert([
			{
				character_id: getCharacter[0].id,
				updated_at: new Date(),
			},
		]);

	if (addAchievementRequestTimestampError) {
		return res.sendStatus(400);
	}

	let characterName = getCharacter[0].name;
	const realmSlug = getCharacter[0].realm_slug;

	characterName =
		characterName.charAt(0).toLowerCase() + characterName.slice(1);

	const decodedJWTToken = decodedToken;
	const characterAchievementsResponse = await fetch(
		`https://us.api.blizzard.com/profile/wow/character/${realmSlug}/${characterName}/achievements?namespace=profile-us&locale=en_US&_page=1&_pageSize=10`,
		{
			method: "GET",
			headers: {
				Authorization: "Bearer " + decodedJWTToken.access_token,
			},
		}
	).catch((error) => {
		console.error("Error:", error);
		return error;
	});

	if (!characterAchievementsResponse.ok) {
		throw new Error("Network response was not ok");
	}
	return characterAchievementsResponse;
}

module.exports = { getCharacterAchievements };
