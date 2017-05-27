import test from 'ava'
import sinon from 'sinon'
import { loadJS } from '../../src/clientLogin'
import * as utils from '../../src/utils'

test.beforeEach(t => {
  const loaded = (win) => new Promise(resolve => {
    // stubs out the google api load function
    win.gapi = Object.assign(
      {},
      win.gapi || {},
      { load: (name, callback) => callback() }
    )
    return resolve({})
  })
  const stubLoadScript = (win) => sinon.stub(utils, 'loadScript').returns(loaded(win))
  t.context = {
    loaded,
    stubLoadScript
  }
})

test('returns a promise when script is already loaded', t => {
  const val = loadJS({ document: {}, gapi: { auth2: 'hey' } })
  t.truthy(val.then)
})

test('loads script https://apis.google.com/js/platform.js', t => {
  const src = 'https://apis.google.com/js/platform.js'
  const win = { document: {} }
  const spy = t.context.stubLoadScript(win)
  const val = loadJS(win)
  t.truthy(spy.calledWith(src, win.document))
  utils.loadScript.restore()
})

test('returns a promise when script is not yet loaded', t => {
  const win = { document: {}}
  const spy = t.context.stubLoadScript(win)
  const val = loadJS(win)
  t.truthy(val.then)
  utils.loadScript.restore()
})

test('does not load script when already loaded', t => {
  const win = { document: {}, gapi: { auth2: 'hey' } }
  const spy = t.context.stubLoadScript(win)
  const val = loadJS(win)
  t.falsy(spy.called)
  utils.loadScript.restore()
})

test('when script already loaded resolves promise with the google api', t => {
  const gapi = { auth2: 'hey' }
  const win = { document: {}, gapi }
  const spy = t.context.stubLoadScript(win)
  const expectedApi = win.gapi
  const val = loadJS(win)
  utils.loadScript.restore()
  return val.then(api => {
    t.is(api, expectedApi)
  })
})

test('when script not yet loaded resolves promise with the google api', t => {
  const win = { document: {}}
  const spy = t.context.stubLoadScript(win)
  const expectedApi = win.gapi
  const val = loadJS(win)
  utils.loadScript.restore()
  return val.then(api => {
    t.is(api, expectedApi)
  })
})

test('does not load script twice when beginning load', t => {
  const win = { document: {} }
  const delayedLoaded = new Promise(resolve => {
    win.gapi = { load: (name, callback) => callback() }
    setTimeout(resolve, 10)
  })
  const spy = sinon.stub(utils, 'loadScript').returns(delayedLoaded)
  const val1 = loadJS(win)
  const val2 = loadJS(win)
  t.truthy(spy.calledOnce)
  utils.loadScript.restore()
})

test('does not leave artifacts in the win object after load', t => {
  const win = { document: {} }
  const spy = t.context.stubLoadScript(win)
  const expectedApi = win.gapi
  const val = loadJS(win)
  utils.loadScript.restore()
  return val.then(() => {
    t.falsy(win.loadingGapi)
  })
})

test('does not leave artifacts in the win object after multiple loads', t => {
  const win = { document: {} }
  const delayedLoaded = new Promise(resolve => {
    win.gapi = { load: (name, callback) => callback() }
    setTimeout(resolve, 10)
  })
  const spy = sinon.stub(utils, 'loadScript').returns(delayedLoaded)
  const val1 = loadJS(win)
  const val2 = loadJS(win)
  utils.loadScript.restore()
  return val2.then(() => {
    t.falsy(win.loadingGapi)
  })
})
