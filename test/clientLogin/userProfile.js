import test from 'ava'

import { userProfile } from '../../src/clientLogin'

test(
  'returns falsy when window is null',
  t => t.falsy(userProfile(null))
)

test(
  'returns falsy when no gapi is present',
  t => t.falsy(userProfile({}))
)

test(
  'returns falsy when gapi has no auth2 obj',
  t => t.falsy(userProfile({ gapi: {}}))
)

test(
  'returns falsy when gapi.auth2 has no getAuthInstance obj',
  t => t.falsy(userProfile({ gapi: { auth2: {} }}))
)

test(
  'returns falsy when gapi.auth2.getAuthInstance returns false',
  t => t.falsy(userProfile({ gapi: { auth2: { getAuthInstance: () => false }}}))
)

test(
  'returns falsy when authInstance has no currentUser',
  t => t.falsy(userProfile({ gapi: { auth2: { getAuthInstance: () => {}}}}))
)

test(
  'returns current user object',
  t => {
    const profile = 'hey im a profile'
    const user = { getBasicProfile: () => profile }
    const instance = { currentUser: { get: () => user }}
    const win = {
      gapi: {
        auth2: {
          getAuthInstance: () => instance
        }
      }
    }
    t.is(userProfile(win), profile)
  }
)
