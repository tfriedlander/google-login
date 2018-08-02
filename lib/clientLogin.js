'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userProfile = exports.userIdToken = exports.userId = exports.userAuthResponse = exports.signOut = exports.signIn = exports.onSignInChange = exports.loadJS = exports.isSignedIn = exports.initOAuth = exports.currentUser = exports.authInstance = exports.authIsLoaded = exports.apiIsLoaded = undefined;

var _utils = require('./utils');

/**
 * the set of default sign in options we want
 * see https://developers.google.com/identity/sign-in/web/reference#gapiauth2signinoptions
 * for more info
 */
var defaultSignInParams = {
  ux_mode: 'popup',
  cookie_policy: 'single_host_origin'

  /**
   * checks if the google api has been loaded
   * @param {object} winObj the window object for the page
   * @return {boolean} true if the api is loaded, false if not
   */
}; /* global document window gapi */
/**
 * Google Login module
 * @module src/clientLogin
 * see https://developers.google.com/identity/sign-in/web/sign-in
 */

function apiIsLoaded() {
  var winObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;

  return !!(winObj && winObj.gapi && winObj.gapi.auth2);
}

/**
 * checks if the oauth2 client instance has been loaded
 * @param {object} winObj the window object for the page
 * @return {boolean} true if the oauth2 instance loaded
 */
function authIsLoaded() {
  var winObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;

  return !!(apiIsLoaded(winObj) && winObj.gapi.auth2.getAuthInstance && winObj.gapi.auth2.getAuthInstance());
}

/**
 * Sources in the google JS if needed. Does not allow multiple
 * loads of the script at once. Does not load if api already
 * loaded
 * @param {object} docObj the window.document object
 * @param {object} winObj the window object
 * @return {promise} resolves when the oauth2 google obj has loaded with api as arg
 */
function loadJS() {
  var winObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;

  // google platform api script to load
  var src = 'https://apis.google.com/js/platform.js';
  var loadingId = '_loadingGapi';
  if (apiIsLoaded(winObj)) {
    return Promise.resolve(winObj.gapi);
  }
  // to prevent accidental multiple calls of loadJS at once
  winObj[loadingId] = winObj[loadingId] || (0, _utils.loadScript)(src, winObj.document);
  return winObj[loadingId].then(function () {
    return new Promise(function (resolve) {
      return winObj.gapi.load('auth2', function () {
        delete winObj[loadingId];
        return resolve(winObj.gapi);
      });
    });
  });
}

/**
 * Initializes the google api object for oauth
 * if the script has not been loaded will load
 * the google api script then initialize oauth
 * prevents duplicate initializations happening
 * at once. Does not initialize if already
 * initialized
 * @param {string} clientId the oauth client id to send to google
 * @param {object} params the parameters to send in the initialization
 *   See https://developers.google.com/identity/sign-in/web/reference#gapiauth2clientconfig
 *   for more info
 * @param {string} params.cookie_policy The domains for which to create 
 *   sign-in cookies. Either a URI, single_host_origin, or none. 
 *   Defaults to single_host_origin if unspecified.
 * @param {string} params.scope The scopes to request, as a space-delimited 
 *   string. Optional if fetch_basic_profile is not set to false.
 * @param {boolean} params.fetch_basic_profile Fetch users' basic profile 
 *   information when they sign in. Adds 'profile', 'email' and 'openid' 
 *   to the requested scopes. True if unspecified.
 * @param {string} params.hosted_domain The G Suite domain to which users 
 *   must belong to sign in. This is susceptible to modification by clients, 
 *   so be sure to verify the hosted domain property of the returned user. 
 *   Use GoogleUser.getHostedDomain() on the client, and the hd claim in the 
 *   ID Token on the server to verify the domain is what you expected.
 * @param {string} params.openid_realm Used only for OpenID 2.0 client migration. 
 *   Set to the value of the realm that you are currently using for OpenID 2.0, 
 *   as described in OpenID 2.0 (Migration).
 * @param {string} params.ux_mode The UX mode to use for the sign-in flow. 
 *   By default, it will open the consent flow in a popup. Valid values are 
 *   popup and redirect.
 * @param {string} params.redirect_uri If using ux_mode='redirect', 
 *   this parameter allows you to override the default redirect_uri that will 
 *   be used at the end of the consent flow. The default redirect_uri is the 
 *   current URL stripped of query parameters and hash fragment.
 * @param {object} winObj the window object of the site
 * @return {promise} resolves when auth2 is done initializing
 */
function initOAuth(clientId) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var winObj = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : window;

  if (authIsLoaded(winObj)) {
    return Promise.resolve(winObj.gapi);
  }
  var initId = '_initializingGapiAuth2';
  var oauthParams = Object.assign({ client_id: clientId }, defaultSignInParams, params);
  var initAuth2 = function initAuth2(api) {
    return new Promise(function (resolve, reject) {
      api.auth2.init(oauthParams).then(
      // GoogleAuth onInit - when fully initialized
      // the gapi.auth2.GoogleAuth object is sent in
      function () {
        delete winObj[initId];
        return resolve(api);
      },
      // GoogleAuth onError - when error occurs
      function (error) {
        delete winObj[initId];
        return reject(error);
      });
    });
  };
  return loadJS(winObj).then(function (api) {
    winObj[initId] = winObj[initId] || initAuth2(api);
    return winObj[initId];
  });
}

/**
 * gets the google AuthInstance object from the api
 * @param {object} winObj the window object for the page
 * @return {object} the google auth2 AuthInstance object
 */
function authInstance() {
  var winObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;

  var loaded = authIsLoaded(winObj);
  return loaded ? winObj.gapi.auth2.getAuthInstance() : null;
}

/**
 * gets the GoogleUser object from the google api
 * for the currently logged in user
 * @param {object} winObj the window object for the page
 * @return {GoogleUser} the currently logged in user
 */
function currentUser() {
  var winObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;

  var instance = authInstance(winObj) || {};
  var user = instance.currentUser;
  return user ? user.get() : null;
}

/**
 * returns the current google users authResponse object
 * @param {object} winObj the window object for the page
 * @return {AuthResponse} A gapi.auth2.AuthResponse object.
 */
function userAuthResponse() {
  var winObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;

  var user = currentUser(winObj) || { getAuthResponse: function getAuthResponse() {
      return null;
    } };
  var authResp = user.getAuthResponse();
  return authResp;
}

/**
 * returns the google user id of the logged in user
 * @param {object} winObj the window object for the page
 * @return {string} google user id
 */
function userId() {
  var winObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;

  var user = currentUser(winObj) || { getId: function getId() {
      return null;
    } };
  return user.getId();
}

/**
 * returns the getBasicProfile object
 * You can retrieve the properties of gapi.auth2.BasicProfile with the following methods:
 * BasicProfile.getId()
 * BasicProfile.getName()
 * BasicProfile.getGivenName()
 * BasicProfile.getFamilyName()
 * BasicProfile.getImageUrl()
 * BasicProfile.getEmail()
 * @param {object} winObj the window object for the page
 * @return {BasicProfile} google basic profile object
 */
function userProfile() {
  var winObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;

  var user = currentUser(winObj) || { getBasicProfile: function getBasicProfile() {
      return null;
    } };
  return user.getBasicProfile();
}

/**
 * gets the oauth2 user token to send to the server
 * @param {object} winObj the window object for the page
 * @return {string} oauth2 id token to send to the server
 */
function userIdToken() {
  var winObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;

  return (userAuthResponse(winObj) || {}).id_token;
}

/**
 * checks if the google user is signed in
 * @param {object} winObj the window object for the page
 * @return {boolean} true if the user is signed in
 */
function isSignedIn() {
  var winObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;

  var instance = authInstance(winObj) || {};
  var isUserSignedIn = instance.isSignedIn || { get: function get() {
      return false;
    } };
  return isUserSignedIn.get();
}

/**
 * assigns a listener for sign in changes
 * @param {function} listener receives a boolean arg, true if signed in
 * @param {object} winObj the window object for the page
 * @return {boolean} true if assigned listener
 */
function onSignInChange(listener) {
  var winObj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;

  var instance = authInstance(winObj);
  if (instance && instance.isSignedIn && instance.isSignedIn.listen) {
    instance.isSignedIn.listen(listener);
    return true;
  }
  return false;
}

/**
 * signs the google user in
 * @param {object} params the parameters to send in the initialization
 *   See https://developers.google.com/identity/sign-in/web/reference#gapiauth2clientconfig
 *   for more info
 * @param {string} params.cookie_policy The domains for which to create 
 *   sign-in cookies. Either a URI, single_host_origin, or none. 
 *   Defaults to single_host_origin if unspecified.
 * @param {string} params.scope The scopes to request, as a space-delimited 
 *   string. Optional if fetch_basic_profile is not set to false.
 * @param {boolean} params.fetch_basic_profile Fetch users' basic profile 
 *   information when they sign in. Adds 'profile', 'email' and 'openid' 
 *   to the requested scopes. True if unspecified.
 * @param {string} params.hosted_domain The G Suite domain to which users 
 *   must belong to sign in. This is susceptible to modification by clients, 
 *   so be sure to verify the hosted domain property of the returned user. 
 *   Use GoogleUser.getHostedDomain() on the client, and the hd claim in the 
 *   ID Token on the server to verify the domain is what you expected.
 * @param {string} params.openid_realm Used only for OpenID 2.0 client migration. 
 *   Set to the value of the realm that you are currently using for OpenID 2.0, 
 *   as described in OpenID 2.0 (Migration).
 * @param {string} params.ux_mode The UX mode to use for the sign-in flow. 
 *   By default, it will open the consent flow in a popup. Valid values are 
 *   popup and redirect.
 * @param {string} params.redirect_uri If using ux_mode='redirect', 
 *   this parameter allows you to override the default redirect_uri that will 
 *   be used at the end of the consent flow. The default redirect_uri is the 
 *   current URL stripped of query parameters and hash fragment.
 * @param {object} winObj the window of the current page
 * @return {promise} a promise that is fullfilled when the user logs in
 */
function signIn() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var winObj = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : window;

  var signInParams = Object.assign({}, defaultSignInParams, params);
  var instance = authInstance(winObj);
  if (instance && instance.signIn) {
    return instance.signIn(signInParams);
  }
  return Promise.reject(new TypeError('auth instance not initialized'));
}

/**
 * signs the google user out
 * @param {object} winObj the window of the current page
 * @return {promise} a promise that is fullfilled when the user is logged out
 */
function signOut() {
  var winObj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window;

  var instance = authInstance(winObj);
  if (instance && instance.signOut) {
    return instance.signOut();
  }
  return Promise.reject(new TypeError('auth instance not initialized'));
}

/*
 * renders ui button to log a user in
 * see https://developers.google.com/identity/sign-in/web/reference#gapisignin2renderid-options
 * @param {string} id the dom object id to place the button within
 * @param {object} options the options to render with
 * @param {object} api the google api object
 * @return {object} returns the google api for chaining purposes
function renderSignInButton(id, options = {}, winObj = window) {
  window.gapi.signin2.render(id, options)
}
*/

exports.apiIsLoaded = apiIsLoaded;
exports.authIsLoaded = authIsLoaded;
exports.authInstance = authInstance;
exports.currentUser = currentUser;
exports.initOAuth = initOAuth;
exports.isSignedIn = isSignedIn;
exports.loadJS = loadJS;
exports.onSignInChange = onSignInChange;
exports.signIn = signIn;
exports.signOut = signOut;
exports.userAuthResponse = userAuthResponse;
exports.userId = userId;
exports.userIdToken = userIdToken;
exports.userProfile = userProfile;