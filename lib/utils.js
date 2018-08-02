'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/* globals document */
/**
 * Utils module
 * @module src/utils
 * handy utility methods
 */

/**
 * returns the head dom element from a document dom object
 * @param {object} doc the document object of the page
 * @return {object} head dom object or null if not found
 */
function getHeadEl() {
  var doc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;

  if (doc && doc.getElementsByTagName) {
    return doc.getElementsByTagName('head')[0];
  }
  return null;
}

/**
 * returns the body dom element form the document dom object
 * @param {object} doc the document object of the page
 * @return {object} body dom object or null if not found
 */
function getBodyEl() {
  var doc = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;

  var _ref = doc || {},
      body = _ref.body,
      documentElement = _ref.documentElement;

  return body || documentElement;
}

/**
 * creates a script object and adds a load listener to it
 * throws an error when no dom object available
 * @param {string} src the script source to load
 * @param {function} callback the function to call when the script is loaded
 * @param {object} doc the document object of the page
 * @return {object} the script dom element created
 */
function createScriptObj(src, callback) {
  var doc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document;

  if (!doc || !doc.createElement) {
    throw new Error('unable to create dom object');
  }
  var script = doc.createElement('script');
  script.addEventListener('load', callback, false);
  script.type = 'text/javascript';
  script.src = src;
  return script;
}

/**
 * dynamically loads a javascript file using promises
 * @param {string} src the script source to load
 * @param {object} doc the document object of the page
 * @return {promise} resolves to when the script is loaded
 */
function loadScript(src) {
  var doc = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

  return new Promise(function (resolve, reject) {
    var script = createScriptObj(src, resolve, doc);
    var parent = getHeadEl(doc) || getBodyEl(doc);
    parent.appendChild(script);
    return true;
  });
}

exports.loadScript = loadScript;
exports.getHeadEl = getHeadEl;
exports.getBodyEl = getBodyEl;
exports.createScriptObj = createScriptObj;
exports.default = { loadScript: loadScript };