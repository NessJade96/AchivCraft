import express from "express"
import jwt  from "jsonwebtoken";
import {
	getCharacterAchievements,
}  from "../modules/battleNet/getCharacterAchievements"
import { createClient }  from "../databaseClient"



const router = express.Router();


router.get("/achievement", async function (req, res) {
	console.log("🚀 ~ req:", req.cookies)
	const supabase = createClient({ req, res });
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError) {
		console.log("🚀 ~ userError:", userError);
		res.status(400);
		res.json({
			message: "no user found",
			cookies: req.cookies
		})
		res.send();
		return;
	}

	// On load we are going to fetch the last time a timestamp was updated within the last  5 mins
	const currentTime = new Date();
	// @ts-expect-error get deployment working

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

	// Lists the current users followed character's that have achievements older than 5mins
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

	// Retrieve the JWT from cookies
	const signedJwt = req.cookies.jwt;
	if (!signedJwt) {
		res.status(401).json({ message: "JWT not found" });
		return;
	}
	// Verify the JWT
	const decodedToken = jwt.verify(signedJwt, "Super_Secret_Password");
	// @ts-expect-error get deployment working

	if (!decodedToken.access_token) {
		res.status(401).json({ message: "Invalid access token" });
		return;
	}

	// Format the characters that require updated achievements
	const refetchedAchievementPromises = getOldAchievementsData.map(
		async (character) => {
			const characterData = {
				id: character.character_id,
				// @ts-expect-error get deployment working

				name: character.character.name,
				// @ts-expect-error get deployment working

				realm_slug: character.character.realm_slug,
			};
			const characterAchievementsResponse =
				await getCharacterAchievements(
					req,
					res,
					decodedToken,
					characterData
				);
			const characterAchievementsBody =
				await characterAchievementsResponse.json();

			// format achievements
			const latestAchievements =
				characterAchievementsBody.achievements.length > 100
					? characterAchievementsBody.achievements.slice(-100)
					: characterAchievementsBody.achievements;

			const latestAchievementsWithTimestamp = latestAchievements.filter(
			// @ts-expect-error get deployment working

				(achievement) => achievement.completed_timestamp
			);
// @ts-expect-error get deployment working

			return latestAchievementsWithTimestamp.map((achievement) => {
				return {
					name: achievement.achievement.name,
					wow_api_id: achievement.id,
					completed_timestamp: new Date(
						achievement.completed_timestamp
					),
					character_id: character.character_id,
				};
			});
		}
	);

	const refetchedAchievements = await Promise.all(
		refetchedAchievementPromises
	);

	// Then insert to Supabase the result of the fetched achievements for each element in array
	const { error: addAchievementsError } = await supabase
		.from("achievement")
		.upsert(refetchedAchievements.flat(), {
			onConflict: "wow_api_id, character_id",
		});

	if (addAchievementsError) {
		console.log("🚀 ~ addAchievementsError:", addAchievementsError);
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
			)// @ts-expect-error get deployment working

			.eq("character.follow.user_id", user.id)
			.order("completed_timestamp", { ascending: false });

	if (characterAchievementError) {
		return res.sendStatus(400);
	}

	res.json(characterAchievementData);
});

export {
	router
}

