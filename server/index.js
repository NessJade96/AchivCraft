require('dotenv').config();
const express = require('express')
require('./src/databaseClient.js')
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require("cors")
const corsOptions = {
  origin: 'http://localhost:5173', // Allow requests from this origin
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204,
  credentials: true
};

app.use(cors(corsOptions));
app.use(cookieParser());

const credentials = btoa(process.env.BNET_OAUTH_CLIENT_ID + ':' + process.env.BNET_OAUTH_CLIENT_SECRET);
const formData = new URLSearchParams();
formData.append('grant_type', 'client_credentials');

app.get('/ping', function(req, res){
  return res.json({
    ping: true
  })
})

app.get('/login', async function(req, res){
  console.log(process.env.BNET_OAUTH_CLIENT_SECRET)
  console.log(process.env.BNET_OAUTH_CLIENT_ID)
  const response = await fetch(`https://us.battle.net/oauth/token`, {
		method: 'POST',
		body: formData,
		headers: {'Content-Type': 'application/x-www-form-urlencoded','Authorization':'Basic '+ credentials},
	})
  .catch(error => console.error('Error:', error));
  if (!response.ok) {
    console.log(response)
    throw new Error('Network response was not ok');
  }
  const responseJSON = await response.json()
  console.log(responseJSON, responseJSON.access_token)

const user = {
  id: 123,
  username: 'example_user',
  bearerToken: responseJSON.access_token
};
  const jwtToken = jwt.sign(user, 'Super_Secret_Password');
  console.log('JWT Token:', jwtToken);
  res.cookie('jwt', jwtToken, { httpOnly: true, maxAge: 3600000, domain: 'localhost',path: "/" }); // maxAge is in milliseconds (1 hour in this case)
  res.json({ success: true })
})

app.get('/profile/wow/character', async function(req, res) {
    // Retrieve the JWT from cookies
    const token = req.cookies.jwt;
    console.log("token", token, req.cookies)

    if (!token) {
        return res.status(401).json({ message: 'JWT not found in cookies' });
    }
  // Verify the JWT
  const decodedToken = jwt.verify(token, 'Super_Secret_Password');
  console.log(decodedToken, "decodedToken")
  
  const toon = 'astraxi'

  const characterAchievements = await fetch(`https://us.api.blizzard.com/profile/wow/character/frostmourne/${toon}/achievements?namespace=profile-us&locale=en_US`, {
		method: 'GET',
		headers: { 'Authorization':'Bearer '+ decodedToken.bearerToken},
	})
  .catch(error => console.error('Error:', error));
  if (!characterAchievements.ok) {
    console.log(characterAchievements)
    throw new Error('Network response was not ok');
  }
  const characterAchievementsJSON = await characterAchievements.json()
  console.log(characterAchievementsJSON, characterAchievementsJSON.total_points)
  res.json(characterAchievementsJSON)
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.use(function (err, req, res, next) {
  console.error(err);
  res.send("<h1>Internal Server Error</h1>");
});

const server = app.listen(3000, function() {
  console.log('Listening on port %d', server.address().port);
});