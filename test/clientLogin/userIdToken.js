import test from 'ava'

import { userIdToken } from '../../src/clientLogin'

test(
  'returns falsy when window is null',
  t => t.falsy(userIdToken(null))
)

test(
  'returns falsy when no gapi is present',
  t => t.falsy(userIdToken({}))
)

test(
  'returns falsy when gapi has no auth2 obj',
  t => t.falsy(userIdToken({ gapi: {}}))
)

test(
  'returns falsy when gapi.auth2 has no getuserAuthResponse obj',
  t => t.falsy(userIdToken({ gapi: { auth2: {} }}))
)

test(
  'returns falsy when gapi.auth2.getAuthInstance returns false',
  t => t.falsy(userIdToken({ gapi: { auth2: { getAuthInstance: () => false }}}))
)

test(
  'returns falsy when authInstance has no userAuthResponse',
  t => t.falsy(userIdToken({ gapi: { auth2: { getAuthInstance: () => {}}}}))
)

test('returns falsy when currentUser is falsy', t => {
    const instance = { currentUser: { get: () => null}}
    const win = {
      gapi: {
        auth2: {
          getAuthInstance: () => instance
        }
      }
    }
  t.falsy(userIdToken(win))
})

test('returns current user auth response', t => {
  const idToken = 'im an id token'
  const authResp = {
    id_token: idToken
  }
  const user = {
    getAuthResponse: () => authResp
  }
  const instance = { currentUser: { get: () => user }}
  const win = {
    gapi: {
      auth2: {
        getAuthInstance: () => instance
      }
    }
  }
  t.is(userIdToken(win), idToken)
})
