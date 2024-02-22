const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
	getCharacterAchievements,
} = require("../modules/battleNet/getCharacterAchievements");

router.get("/achievement", async function (req, res) {
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
		decodedToken
	);
	const characterAchievementsJSON =
		await characterAchievementsResponse.json();
	res.json(characterAchievementsJSON);
	return characterAchievementsResponse;
});

module.exports = { router };
