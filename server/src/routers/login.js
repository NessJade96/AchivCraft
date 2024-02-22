const express = require("express");
const router = express.Router();
const { createClient } = require("../databaseClient.js");
const jwt = require("jsonwebtoken");
const {getBattleNetToken} = require("../modules/battleNet/getBattleNetToken.js");

router.post("/", async function (req, res) {
	const { email, password } = req.body;

	if (!email || !password) {
		res.sendStatus(401);
		return;
	}

	const supabase = createClient({ req, res });

	const {
		data: { user },
	} = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (!user) {
		res.sendStatus(401);
		return;
	}

	const battleNetTokenJson = await getBattleNetToken();

	const signedJwt = jwt.sign(
		{
			access_token: battleNetTokenJson.access_token,
		},
		"Super_Secret_Password"
	);

	res.cookie("jwt", signedJwt, {
		httpOnly: true,
		maxAge: 3600000,
		domain: "localhost",
		path: "/",
	}); // maxAge is in milliseconds (1 hour in this case)
	res.json({ success: true });
});

module.exports = { router };
