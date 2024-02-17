require('dotenv').config();
const express = require('express')
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require("cors")
const bodyParser = require('body-parser');
const {supabaseClient} =require("./src/databaseClient.js")

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // Allow requests from this origin
  optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204,
  credentials: true
}));
app.use(bodyParser.json());

const credentials = btoa(process.env.BNET_OAUTH_CLIENT_ID + ':' + process.env.BNET_OAUTH_CLIENT_SECRET);
const formData = new URLSearchParams();
formData.append('grant_type', 'client_credentials');

app.get('/ping', function(req, res){
  return res.json({
    ping: true
  })
})

app.post('/login', async function(req, res){
  const {email, password} = req.body

  if (!email || !password) {
    res.sendStatus(401);
    return;
  }


  const { data: {user} } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  })

  if (!user) {
    res.sendStatus(401);
    return;
  }

  const battleNetTokenResponse  = await fetch(`https://us.battle.net/oauth/token`, {
		method: 'POST',
		body: formData,
		headers: {'Content-Type': 'application/x-www-form-urlencoded','Authorization':'Basic '+ credentials},
	})
  .catch(error => {
    console.error('Error:', error)
    return error
  });

  if (!battleNetTokenResponse.ok) {
    throw new Error('Network response was not ok');
  }

  const battleNetTokenJson = await battleNetTokenResponse.json()

  const signedJwt = jwt.sign({
    access_token: battleNetTokenJson.access_token
  }, 'Super_Secret_Password');

  res.cookie('jwt', signedJwt, { httpOnly: true, maxAge: 3600000, domain: 'localhost',path: "/" }); // maxAge is in milliseconds (1 hour in this case)
  res.json({ success: true })

})



app.get('/profile/wow/character', async function(req, res) {
    // Retrieve the JWT from cookies
    const signedJwt = req.cookies.jwt;
    if (!signedJwt) {
      res.status(401).json({ message: 'JWT not found' });
    return;
    }

  // Verify the JWT
  const decodedToken = jwt.verify(token, 'Super_Secret_Password');
  
  if (!decodedToken.access_token) {
    res.status(401).json({ message: 'Invalid access token' });
    return;
}
  const toon = 'astraxi'

  const characterAchievementsResponse = await fetch(`https://us.api.blizzard.com/profile/wow/character/frostmourne/${toon}/achievements?namespace=profile-us&locale=en_US`, {
		method: 'GET',
		headers: { 'Authorization':'Bearer '+ decodedToken.access_token},
	})
  .catch(error =>{
    console.error('Error:', error)
    return error
  });

  if (!characterAchievementsResponse.ok) {
    throw new Error('Network response was not ok');
  }
  const characterAchievementsJSON = await characterAchievementsResponse.json()
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