import express from "express";
import { createClient } from "../databaseClient";

const router = express.Router();

router.get("/", async function (req, res) {
	const supabase = createClient({ req, res });

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		res.sendStatus(401);
		return;
	}
	res.json(user);
});

export { router };
