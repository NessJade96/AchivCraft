const express = require("express");
const router = express.Router();
const { createClient } = require("../databaseClient.js");
const jwt = require("jsonwebtoken");

router.get("/", async function (req, res) {
	const { realmSlug, characterName } = req.query;
	const supabase = createClient({ req, res });
	const capitalizedCharacterName =
		characterName.charAt(0).toUpperCase() + characterName.slice(1);

	const { data: checkCharacterData, error: checkCharacterError } =
		await supabase
			.from("character")
			.select("*")
			.eq("realm_slug", realmSlug)
			.eq("name", capitalizedCharacterName);

	let characterDataResponse = checkCharacterData[0];

	if (checkCharacterError) {
		console.log("🚀 ~ checkCharacterError:", checkCharacterError);
		return res.sendStatus(400);
	}

	// If character is found return character data
	if (characterDataResponse) {
		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();

		if (userError) {
			console.log("🚀 ~ userError:", userError);
			return res.sendStatus(400);
		}

		const { data: checkFollowing, error: checkFollowingError } =
			await supabase
				.from("follow")
				.select("*")
				.eq("user_id", user.id)
				.eq("character_id", characterDataResponse.id);

		if (checkFollowingError) {
			console.log("🚀 ~ checkFollowingError:", checkFollowingError);
			return res.sendStatus(400);
		}
		const characterOutput = {
			name: characterDataResponse.name,
			faction: characterDataResponse.faction,
			race: characterDataResponse.race,
			class: characterDataResponse.class,
			achievementPoints: characterDataResponse.achievement_points,
			realmSlug: characterDataResponse.realm_slug,
			isFollowing: checkFollowing.length > 0,
		};

		if (characterOutput.isFollowing) {
			console.log("you are following this character");
		} else {
			console.log("you are NOT following this character");
		}
		res.json(characterOutput);
		return;
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

	//GETs the characters info from WOW api
	const characterResponse = await fetch(
		`https://us.api.blizzard.com/profile/wow/character/${realmSlug}/${characterName}?namespace=profile-us&locale=en_US`,
		{
			method: "GET",
			headers: {
				Authorization: "Bearer " + decodedToken.access_token,
			},
		}
	).catch((error) => {
		console.error("Error:", error);
		return error;
	});

	if (!characterResponse.ok) {
		throw new Error("Network response was not ok");
	}
	const characterJSON = await characterResponse.json();
	const character = {
		name: characterJSON.name,
		faction: characterJSON.faction.name,
		race: characterJSON.race.name,
		class: characterJSON.character_class.name,
		achievementPoints: characterJSON.achievement_points,
		realmSlug: characterJSON.realm.slug,
		isFollowing: false,
	};
	console.log(
		"This character is not in the DB and the user is NOT following this character"
	);
	res.json(character);
});

module.exports = { router };
