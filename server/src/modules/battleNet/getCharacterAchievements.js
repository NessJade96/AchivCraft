async function getCharacterAchievements(req, res, decodedToken) {
	const { realmSlug, characterName } = req.query;
	const decodedJWTToken = decodedToken;
	const characterAchievementsResponse = await fetch(
		`https://us.api.blizzard.com/profile/wow/character/${realmSlug}/${characterName}/achievements?namespace=profile-us&locale=en_US`,
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
