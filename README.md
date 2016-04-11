
# Passport-Predix-Oauth

[Passport](http://passportjs.org/docs) strategy for authenticating
with [Predix UAA service](https://www.predix.io/services/service.html?id=1172) using the OAuth 2.0 API.

<p align='center'>
<img src="https://www.predix.io/assets/images/resources/whitepaper.png" height="400px" />
</p>

    
## Overview of Predix UAA

The [Predix platform](https://www.predix.io/) provides [UAA as a service](https://www.predix.io/services/service.html?id=1172) for developers to authenticate their application users. As a Predix platform user, you can secure access to your application by obtaining a UAA instance from the Cloud Foundry marketplace and configuring it to authenticate trusted users. 

## Installation

    $ npm install passport-predix-oauth

## Usage

### COMING SOON: Detailed Example in a Node.js starter application
```javascript
var cfStrategy = new CloudFoundryStrategy({
 	clientID: CLIENT_ID,
 	clientSecret: CLIENT_SECRET,
  	callbackURL: CALLBACK_URL,
  	authorizationURL: AUTHORIZATION_URL,
  	tokenURL: TOKEN_URL,
},refreshStrategy.getOAuth2StrategyCallback() //Create a callback for OAuth2Strategy
function(accessToken, refreshToken, profile, done) {      
	 token = accessToken;
	 done(null, profile);
});

passport.use(cfStrategy);
```
