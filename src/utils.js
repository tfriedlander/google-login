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
function getHeadEl(doc = document) {
  if (doc && doc.getElementsByTagName) {
    return doc.getElementsByTagName('head')[0]
  }
  return null
}

/**
 * returns the body dom element form the document dom object
 * @param {object} doc the document object of the page
 * @return {object} body dom object or null if not found
 */
function getBodyEl(doc = document) {
  const docObj = doc || {}
  return docObj.body || docObj.documentElement
}

/**
 * creates a script object and adds a load listener to it
 * throws an error when no dom object available
 * @param {string} src the script source to load
 * @param {function} callback the function to call when the script is loaded
 * @param {object} doc the document object of the page
 * @return {object} the script dom element created
 */
function createScriptObj(src, callback, doc = document) {
  if (!doc || !doc.createElement) {
    throw new TypeError('unable to create dom object')
  }
  const script = doc.createElement('script')
  script.addEventListener('load', callback, false)
  script.type = 'text/javascript'
  script.src = src
  return script
}

/**
 * dynamically loads a javascript file using promises
 * @param {string} src the script source to load
 * @param {object} doc the document object of the page
 * @return {promise} resolves to when the script is loaded
 */
function loadScript(src, doc = document) {
  return new Promise((resolve, reject) => {
    const script = createScriptObj(src, resolve, doc)
    const parent = getHeadEl(doc) || getBodyEl(doc)
    parent.appendChild(script)
    return true
  })
}

export { loadScript, getHeadEl, getBodyEl, createScriptObj }
export default { loadScript }
