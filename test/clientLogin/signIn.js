import test from 'ava'
import sinon from 'sinon'
import { signIn } from '../../src/clientLogin.js'

//  winObj.gapi.auth2.getAuthInstance()

test.beforeEach(t => {
  const defaultParams = {
    ux_mode: 'popup',
    cookie_policy: 'single_host_origin'
  }
  t.context = {
    errorMsg: 'auth instance not initialized',
    defaultParams
  }
})

test('rejects when window object is null', t => {
  return signIn({}, null)
    .catch(error => t.is(error.message, t.context.errorMsg))
})

test('rejects when window object does not have gapi object', t => {
  return signIn({}, {})
    .catch(error => t.is(error.message, t.context.errorMsg))
})

test('rejects when gapi does not have auth2 object', t => {
  return signIn({}, { gapi: {} })
    .catch(error => t.is(error.message, t.context.errorMsg))
})

test('rejects when auth2 object does not have getAuthInstance', t => {
  return signIn({}, { gapi: { auth2: {} }})
    .catch(error => t.is(error.message, t.context.errorMsg))
})

test('rejects when getAuthInstance is falsy', t => {
  return signIn({}, { gapi: { auth2: { getAuthInstance: () => false }}})
    .catch(error => t.is(error.message, t.context.errorMsg))
})

test('rejects when auth instance has no sign in method', t => {
  const instance = {}
  const win = {
    gapi: {
      auth2: {
        getAuthInstance: () => instance
      }
    }
  }
  return signIn({}, win)
    .catch(error => t.is(error.message, t.context.errorMsg))
})

test('rejects when auth instance has no sign in method', t => {
  const instance = {}
  const win = {
    gapi: {
      auth2: {
        getAuthInstance: () => instance
      }
    }
  }
  return signIn({}, win)
    .catch(error => t.is(error.message, t.context.errorMsg))
})

test('returns a promise', t => {
  const instance = {
    signIn: () => Promise.resolve('hi')
  }
  const win = {
    gapi: {
      auth2: {
        getAuthInstance: () => instance
      }
    }
  }
  t.truthy(signIn({}, win).then)
})

test('sends in default parameters to signIn', t => {
  const signInStub = sinon.stub().returns(Promise.resolve('hi'))
  const instance = {
    signIn: signInStub
  }
  const win = {
    gapi: {
      auth2: {
        getAuthInstance: () => instance
      }
    }
  }
  signIn({}, win)
  t.truthy(signInStub.calledWith(t.context.defaultParams))
})

test('sends in custom parameters to signIn', t => {
  const params = {
    hi: 'you'
  }
  const expected = Object.assign({}, t.context.defaultParams, params)
  const signInStub = sinon.stub().returns(Promise.resolve('hi'))
  const instance = {
    signIn: signInStub
  }
  const win = {
    gapi: {
      auth2: {
        getAuthInstance: () => instance
      }
    }
  }
  signIn(params, win)
  t.truthy(signInStub.calledWith(expected))
})

test('custom parameters overrides defaults to signIn', t => {
  const params = {
    ux_mode: 'marry-poppins'
  }
  const expected = Object.assign({}, t.context.defaultParams, params)
  const signInStub = sinon.stub().returns(Promise.resolve('hi'))
  const instance = {
    signIn: signInStub
  }
  const win = {
    gapi: {
      auth2: {
        getAuthInstance: () => instance
      }
    }
  }
  signIn(params, win)
  t.truthy(signInStub.calledWith(expected))
})
