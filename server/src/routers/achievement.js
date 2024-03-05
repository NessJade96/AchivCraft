const express = require("express");
const router = express.Router();
const { createClient } = require("../databaseClient.js");

// This function will load all achievements saved to the data base
// Firstly it fetches all your followed characters
//      then it checks to see if there are any new ones
//      adds

router.get("/", async function (req, res) {
	// List all of the users followed characters
	// supabase query to select all in the follow table where the user id matches

	const supabase = createClient({ req, res });
	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError) {
		console.log("🚀 ~ userError:", userError);
		return res.sendStatus(400);
	}

	const { data: getCharacterData, error: getCharacterError } = await supabase
		.from("follow")
		.select("*")
		.eq("user_id", user.id);

	console.log("🚀 ~ getCharacterData:", getCharacterData);

	//let characterDataResponse = getCharacterData[0];

	if (getCharacterError) {
		//console.log("🚀 ~ getCharacterError:", getCharacterError);
		return res.sendStatus(400);
	}
    
	return;
});

module.exports = { router };
