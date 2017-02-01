var util = require('util'),
    OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

function PredixStrategy(options, verify) {
    options = options || {};

    // These 3 can be set individually, or just set uaaURL.
    //  authorizationURL and tokenURL should probably be modified to work like userProfileURL.
    //  keeping as-is for backwards compatibility.
    options.authorizationURL = (options.uaaURL || options.authorizationURL) + '/oauth/authorize';
    options.tokenURL = (options.uaaURL || options.tokenURL) + '/oauth/token';
    options.userProfileURL = options.uaaURL ? options.uaaURL + '/userinfo' : options.userProfileURL;

    //Send clientID & clientSecret in 'Authorization' header
    var auth = 'Basic ' + new Buffer(options.clientID + ':' + options.clientSecret).toString('base64');
    options.customHeaders = {
        'Authorization':auth
    };

    this._origCustomHeader = {
        'Authorization':auth
    };

    OAuth2Strategy.call(this, options, verify);

    this.name = 'predix';

    this._oauth2.setAuthMethod('Bearer');

    // This is a "monkey patch" to fix the oauth2._executeRequest to work with a proxy.
    //  hopefully they'll fix this one day, in the oauth2 package.
    var originalExecuteRequest = this._oauth2._executeRequest;
    this._oauth2._executeRequest = function( http_library, options, post_body, callback ) {
        if (process.env['https_proxy']) {
            var whitelist = false;
            // Check the no_proxy env var for domains/hosts that should NOT use the proxy
            if(process.env['no_proxy']) {
                var nops = process.env['no_proxy'].split(',');
                for(var nop of nops) {
                    if(options.host.endsWith(nop)) {
                        whitelist = true;
                        break;
                    }
                }
            }

            if(!whitelist) {
                var HttpsProxyAgent = require('https-proxy-agent');
                options.agent = new HttpsProxyAgent(process.env['https_proxy']);
            }
        }
        return originalExecuteRequest( http_library, options, post_body, callback);
    };

    this._userProfileURI = options.userProfileURL;
}

util.inherits(PredixStrategy, OAuth2Strategy);


/**
 * Set user profile URI for a Cloud Foundry installation.
 * Default value: https://api.cloudfoundry.com/info
 *
 * @param {String} userProfileURI End-point to get user profile (/info in CF)
 */
PredixStrategy.prototype.setUserProfileURI = function (userProfileURI) {
    this._userProfileURI = userProfileURI;
};

/**
 * Resets _customHeaders to original _customHeaders - This is a workaround because of a
 * bug https://github.com/jaredhanson/passport/issues/89 that causes
 * "logout current user & then relogin to fail"
 *
 * Call this 'cfStrategy.reset()' when you are logging off a user.
 */
PredixStrategy.prototype.reset = function () {
    this._oauth2._customHeaders = {};
    this._oauth2._customHeaders['Authorization'] = this._origCustomHeader['Authorization'];
};

/**
 * Override authorizationParams function. In our case, we will check if this._stateParamCallback is
 * set. If so, we'll call that callback function to set {'state' : 'randomStateVal'}
 *
 * @param  {Object} options Hash of options
 * @return {Object}         {} or {'state' : 'randomStateValFrom__stateParamCallback'}
 */
PredixStrategy.prototype.authorizationParams = function(options) {
    if(this._stateParamCallback) {
        return {'state': this._stateParamCallback()};
    }
  return {};
};


PredixStrategy.prototype.setStateParamCallBack = function(callback) {
  this._stateParamCallback = callback;
};
/**
 * Expose `PredixStrategy`.
 */
module.exports = PredixStrategy;
