const express = require("express");
const router = express.Router();

router.get("/", async function (req, res) {
	res.send("OK");
});

module.exports = { router };
