
# Passport-Predix-Oauth

[Passport](http://passportjs.org/docs) strategy for authenticating
with [Predix UAA service](https://www.predix.io/services/service.html?id=1172) using the OAuth 2.0 API.

This strategy is similar to the CloudFoundry strategy but has several benefits when using Predix UAA.

* Support for proxy environment variables because many devs are behind a corporate proxy.
* Simplified configuration.
* Sets the clientID and secret as an Authorization Basic header, which is required by Predix UAA, whereas the CF UAA allows them to be in the POST body.


## Overview of Predix UAA

The [Predix platform](https://www.predix.io/) provides [UAA as a service](https://www.predix.io/services/service.html?id=1172) for developers to authenticate their application users. As a Predix platform user, you can secure access to your application by obtaining a UAA instance from the Cloud Foundry marketplace and configuring it to authenticate trusted users.

## Installation
    $ npm install passport-predix-oauth

## Example Node.js Express starter application
Check out the `app.js` file in this application to see how to use this Passport strategy in an Express web application.
https://github.com/predixdev/predix-nodejs-starter

## Usage
```javascript
var passport = require('passport');
var PredixStrategy = require('passport-predix-oauth').Strategy;
var predixStrategy = new PredixStrategy({
	clientID: CLIENT_ID,
	clientSecret: CLIENT_SECRET,
	callbackURL: CALLBACK_URL,
	uaaURL: UAA_URL
},refreshStrategy.getOAuth2StrategyCallback() //Create a callback for OAuth2Strategy
function(accessToken, refreshToken, profile, done) {
	token = accessToken;
	done(null, profile);
});

passport.use(predixStrategy);
```

In most cases, just setting the uaaURL is all you need. The strategy will append paths to this URL for authorization, token, and user profile.
If desired, you can pass in those three values instead of uaaURL: authorizationURL, tokenURL, and userProfileURL.
(If set, uaaURL will override the others.)

# Copyright
Copyright &copy; 2015, 2016, 2017 GE Global Research. All rights reserved.

The copyright to the computer software herein is the property of
GE Global Research. The software may be used and/or copied only
with the written permission of GE Global Research or in accordance
with the terms and conditions stipulated in the agreement/contract
under which the software has been supplied.

[![Analytics](https://ga-beacon.appspot.com/UA-82773213-1/passport-predix-oauth/readme?pixel)](https://github.com/PredixDev)
