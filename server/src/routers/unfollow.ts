import express from "express";
import { createClient } from "../databaseClient";

const router = express.Router();


router.post("/", async function (req, res) {
	const supabase = createClient({ req, res });

	const { followId } = req.body;

	if (!followId) {
		res.sendStatus(401);

		return;
	}

	const {
		data: { user },
		error: userError,
	} = await supabase.auth.getUser();

	if (userError) {
		console.log("🚀 ~ userError:", userError);
		return res.sendStatus(400);
	}

	const { error: unfollowError } = await supabase
		.from("follow")
		.delete()
		.eq("id", followId)
		// @ts-expect-error get deployment working

		.eq("user_id", user.id);

	if (unfollowError) {
		console.log("🚀 ~ unFollowError:", unfollowError);
		return res.sendStatus(400);
	}
	console.log("unfollowed");
	res.json({ success: true });
});

export {
	router
}
