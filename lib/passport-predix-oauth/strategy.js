var util = require('util'),
    OAuth2Strategy = require('passport-oauth').OAuth2Strategy;



function Strategy(options, verify) {
    options = options || {};

    options.authorizationURL = options.authorizationURL+'/oauth/authorize';
    options.tokenURL = options.tokenURL+'/oauth/token';

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
      var HttpsProxyAgent = require('https-proxy-agent');
      if (process.env['https_proxy']) {
        httpsProxyAgent = new HttpsProxyAgent(process.env['https_proxy']);
      }
      options.agent = httpsProxyAgent;
      return originalExecuteRequest( http_library, options, post_body, callback);
    };

    //FIXME: needs to change to the right url
    this._userProfileURI = 'https://11ccb14b-0a4d-4e1e-ace0-9f6bbcbbe83a.predix-uaa.run.aws-usw02-pr.ice.predix.io/userinfo';
}

util.inherits(Strategy, OAuth2Strategy);


/**
 * Set user profile URI for a Cloud Foundry installation.
 * Default value: https://api.cloudfoundry.com/info
 *
 * @param {String} userProfileURI End-point to get user profile (/info in CF)
 */
Strategy.prototype.setUserProfileURI = function (userProfileURI) {
    this._userProfileURI = userProfileURI;
};

/**
 * Resets _customHeaders to original _customHeaders - This is a workaround because of a
 * bug https://github.com/jaredhanson/passport/issues/89 that causes
 * "logout current user & then relogin to fail"
 *
 * Call this 'cfStrategy.reset()' when you are logging off a user.
 */
Strategy.prototype.reset = function () {
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
Strategy.prototype.authorizationParams = function(options) {
    if(this._stateParamCallback) {
        return {'state': this._stateParamCallback()};
    }
  return {};
};


Strategy.prototype.setStateParamCallBack = function(callback) {
  this._stateParamCallback = callback;
};
/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
