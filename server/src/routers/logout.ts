import express from "express";
import { createClient } from "../databaseClient";

const router = express.Router();


router.post("/", async function (req, res) {
	const supabase = createClient({ req, res });
	let { error } = await supabase.auth.signOut();

	if (error) {
		res.sendStatus(401);
		return;
	}
	res.send();
});

export {
	router
}
