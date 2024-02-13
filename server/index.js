require('dotenv').config();
const express = require('express')
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); 
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  if (req.method === 'OPTIONS') {
      res.sendStatus(200); 
  } else {
      next();
  }
});

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
  res.cookie('jwt', jwtToken, { httpOnly: true, maxAge: 3600000 }); // maxAge is in milliseconds (1 hour in this case)

  // const decoded = jwt.verify(jwtToken, 'Super_Secret_Password');
  // console.log('Decoded Token:', decoded);

  // const bearerTokenFromJWT = decoded.bearerToken;
  // console.log('Bearer Token from JWT:', bearerTokenFromJWT);

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
  
  const toon = 'teyroth'

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
    // const output = `
    //   <html>
    //     <body>
    //       <h1>Achievement Points</h1>
    //       <table>
    //         <tr>
    //           <th>Character</th>
    //           <th>Points</th>
    //           <th>Number of achievements</th>
    //         </tr>
    //         <tr>
    //         <td>${characterAchievementsJSON.character.name}</td>
    //         <td>${characterAchievementsJSON.total_points}</td>
    //         <td>${characterAchievementsJSON.achievements.length}</td>
    //         </tr>
    //       </table>
    //       <br />
    //       <a href="/logout">Logout</a>        
    //     </body>
    //   </html>
    // `;
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