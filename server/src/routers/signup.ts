import express from "express";
import { supabaseClient } from "../databaseClient";
import jwt from "jsonwebtoken";
import {getBattleNetToken} from "../modules/battleNet/getBattleNetToken";

const router = express.Router();


router.post("/", async function (req, res) {
	const { email, password } = req.body;

	if (!email || !password) {
		res.sendStatus(401);
		return;
	}

	const {
		data: { user },
		// @ts-expect-error get deployment working

	} = await supabaseClient.auth.signUp({
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

export  {
	router
}
