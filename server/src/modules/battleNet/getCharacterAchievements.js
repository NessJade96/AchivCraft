async function getCharacterAchievements(req, res, decodedToken, getCharacter) {
	console.log("🚀 ~ getCharacterAchievements ~ getCharacter:", getCharacter);

	let characterName = getCharacter[0].name;
	const realmSlug = getCharacter[0].realm_slug;
	console.log(
		"🚀 ~ getCharacterAchievements ~ characterName:",
		characterName
	);
	characterName =
		characterName.charAt(0).toLowerCase() + characterName.slice(1);
	console.log(
		"🚀 ~ getCharacterAchievements ~ characterName:",
		characterName
	);

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
