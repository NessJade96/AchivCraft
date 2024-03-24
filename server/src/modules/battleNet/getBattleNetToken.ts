const credentials = btoa(
	process.env.BNET_OAUTH_CLIENT_ID +
		":" +
		process.env.BNET_OAUTH_CLIENT_SECRET
);
const formData = new URLSearchParams();
formData.append("grant_type", "client_credentials");

export async function getBattleNetToken() {
	const battleNetTokenResponse = await fetch(
		"https://us.battle.net/oauth/token",
		{
			method: "POST",
			body: formData,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
				Authorization: "Basic " + credentials,
			},
		}
	).catch((error) => {
		console.error("Error:", error);
		return error;
	});

	if (!battleNetTokenResponse.ok) {
		throw new Error("Network response was not ok");
	}
	const battleNetTokenJson = await battleNetTokenResponse.json();
	return battleNetTokenJson;
}

