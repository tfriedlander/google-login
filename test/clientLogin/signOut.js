import test from 'ava'
import { signOut } from '../../src/clientLogin.js'

//  winObj.gapi.auth2.getAuthInstance()

test.beforeEach(t => {
  t.context = {
    errorMsg: 'auth instance not initialized'
  }
})

test('rejects when window object is null', t => {
  return signOut(null)
    .catch(error => t.is(error.message, t.context.errorMsg))
})

test('rejects when window object does not have gapi object', t => {
  return signOut({})
    .catch(error => t.is(error.message, t.context.errorMsg))
})

test('rejects when gapi does not have auth2 object', t => {
  return signOut({ gapi: {} })
    .catch(error => t.is(error.message, t.context.errorMsg))
})

test('rejects when auth2 object does not have getAuthInstance', t => {
  return signOut({ gapi: { auth2: {} }})
    .catch(error => t.is(error.message, t.context.errorMsg))
})

test('rejects when getAuthInstance is falsy', t => {
  return signOut({ gapi: { auth2: { getAuthInstance: () => false }}})
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
  return signOut(win)
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
  return signOut(win)
    .catch(error => t.is(error.message, t.context.errorMsg))
})

test('returns a promise', t => {
  const instance = {
    signOut: () => Promise.resolve('hi')
  }
  const win = {
    gapi: {
      auth2: {
        getAuthInstance: () => instance
      }
    }
  }
  t.truthy(signOut(win).then)
})
