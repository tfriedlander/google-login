import test from 'ava'
import sinon from 'sinon'
import { initOAuth } from '../../src/clientLogin'
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

test('returns a promise when auth is initialized', t => {
  const win = {
    gapi: { 
      auth2: {
        getAuthInstance: () => true
      }
    }
  }
  const cid = 'abc123'
  const params = {}
  const val = initOAuth(cid, params, win)
  t.truthy(val.then)
})

test('returns a promise when auth is not initialized', t => {
  const init = oauthParams => ({
    then: (success, failure) => success()
  })
  const win = {
    gapi: { 
      auth2: {
        init
      }
    }
  }
  const cid = 'abc123'
  const params = {}
  const val = initOAuth(cid, params, win)
  t.truthy(val.then)
})

test('initializes auth object with expected defaults', t => {
  const cid = 'abc123'
  const params = {}
  const defaults = {
    client_id: cid,
    ux_mode: 'popup',
    cookie_policy: 'single_host_origin'
  }
  const init = sinon.stub().returns({
    then: (success, failure) => success()
  })
  const win = {
    gapi: { 
      auth2: {
        init
      }
    }
  }
  return initOAuth(cid, params, win)
    .then(() => t.truthy(init.calledWith(defaults)))
})

test('does not inititalize auth when already initialized', t => {
  const cid = 'abc123'
  const params = {}
  const init = sinon.stub().returns({
    then: (success, failure) => success()
  })
  const win = {
    gapi: { 
      auth2: {
        init
      }
    }
  }
  const val1 = initOAuth(cid, params, win)
  const val2 = initOAuth(cid, params, win)
  return val2.then(() => t.truthy(init.calledOnce))
})

test('params sent in are used for initialization', t => {
  const cid = 'abc123'
  const params = {
    bobby: 'fisher'
  }
  const init = sinon.stub().returns({
    then: (success, failure) => success()
  })
  const win = {
    gapi: { 
      auth2: {
        init
      }
    }
  }
  const val1 = initOAuth(cid, params, win)
  return val1.then(() => t.truthy(init.calledWith(sinon.match(params))))
})

test('params sent in overwrite default params', t => {
  const cid = 'abc123'
  const ux_mode = 'op_mode'
  const params = { ux_mode }
  const defaults = {
    client_id: cid,
    ux_mode: 'popup',
    cookie_policy: 'single_host_origin'
  }
  const expected = Object.assign({}, defaults, params)
  const init = sinon.stub().returns({
    then: (success, failure) => success()
  })
  const win = {
    gapi: { 
      auth2: {
        init
      }
    }
  }
  const val1 = initOAuth(cid, params, win)
  return val1.then(() => t.truthy(init.calledWith(expected)))
})

test('promise resolves with google api object', t => {
  const init = oauthParams => ({
    then: (success, failure) => success()
  })
  const win = {
    gapi: { 
      auth2: {
        init
      }
    }
  }
  const cid = 'abc123'
  const params = {}
  return initOAuth(cid, params, win)
    .then(api => t.is(api, win.gapi))
})

test('promise rejects with error when error occurs with init', t => {
  const msg = 'ahhh real monsters'
  const error = new TypeError(msg)
  const init = oauthParams => ({
    then: (success, failure) => failure(error)
  })
  const win = {
    gapi: { 
      auth2: {
        init
      }
    }
  }
  const cid = 'abc123'
  const params = {}
  return t.throws(initOAuth(cid, params, win))
    .then(err => t.is(err.message, msg))
})
