require("dotenv").config();
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const { router: characterRouter } = require("./src/routers/character.js");
const { router: followRouter } = require("./src/routers/follow.js");
const { router: loginRouter } = require("./src/routers/login.js");
const { router: logoutRouter } = require("./src/routers/logout.js");
const { router: searchRouter } = require("./src/routers/search.js");
const { router: signupRouter } = require("./src/routers/signup.js");
const { router: unfollowRouter } = require("./src/routers/unfollow.js");

app.use(cookieParser());
app.use(
	cors({
		origin: "http://localhost:5173", // Allow requests from this origin
		optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204,
		credentials: true,
	})
);
app.use(bodyParser.json());

app.use("/character", characterRouter);
app.use("/follow", followRouter);
app.use("/login", loginRouter);
app.use("/logout", logoutRouter);
app.use("/search", searchRouter);
app.use("/signup", signupRouter);
app.use("/unfollow", unfollowRouter);

app.use(function (err, req, res) {
	console.error(err);
	return;
});

const server = app.listen(3000, function () {
	console.log("Listening on port %d", server.address().port);
});
