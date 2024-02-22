const express = require("express");
const router = express.Router();
const { createClient } = require("../databaseClient.js");

router.post("/", async function (req, res) {
	const supabase = createClient({ req, res });
	let { error } = await supabase.auth.signOut();

	if (error) {
		res.sendStatus(401);
		return;
	}
	res.send();
});

module.exports = { router };
