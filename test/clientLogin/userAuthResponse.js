import test from 'ava'

import { userAuthResponse } from '../../src/clientLogin'

test(
  'returns falsy when window is null',
  t => t.falsy(userAuthResponse(null))
)

test(
  'returns falsy when no gapi is present',
  t => t.falsy(userAuthResponse({}))
)

test(
  'returns falsy when gapi has no auth2 obj',
  t => t.falsy(userAuthResponse({ gapi: {}}))
)

test(
  'returns falsy when gapi.auth2 has no getuserAuthResponse obj',
  t => t.falsy(userAuthResponse({ gapi: { auth2: {} }}))
)

test(
  'returns falsy when gapi.auth2.getAuthInstance returns false',
  t => t.falsy(userAuthResponse({ gapi: { auth2: { getAuthInstance: () => false }}}))
)

test(
  'returns falsy when authInstance has no userAuthResponse',
  t => t.falsy(userAuthResponse({ gapi: { auth2: { getAuthInstance: () => {}}}}))
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
  t.falsy(userAuthResponse(win))
})

test('returns current user auth response', t => {
  const authResp = 'hey im authy'
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
  t.is(userAuthResponse(win), authResp)
})
