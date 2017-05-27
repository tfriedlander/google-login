import test from 'ava'

import { currentUser } from '../../src/clientLogin'

test(
  'returns falsy when window is null',
  t => t.falsy(currentUser(null))
)

test(
  'returns falsy when no gapi is present',
  t => t.falsy(currentUser({}))
)

test(
  'returns falsy when gapi has no auth2 obj',
  t => t.falsy(currentUser({ gapi: {}}))
)

test(
  'returns falsy when gapi.auth2 has no getAuthInstance obj',
  t => t.falsy(currentUser({ gapi: { auth2: {} }}))
)

test(
  'returns falsy when gapi.auth2.getAuthInstance returns false',
  t => t.falsy(currentUser({ gapi: { auth2: { getAuthInstance: () => false }}}))
)

test(
  'returns falsy when authInstance has no currentUser',
  t => t.falsy(currentUser({ gapi: { auth2: { getAuthInstance: () => {}}}}))
)

test(
  'returns current user object',
  t => {
    const user = 'hi im bob'
    const instance = { currentUser: { get: () => user }}
    const win = {
      gapi: {
        auth2: {
          getAuthInstance: () => instance
        }
      }
    }
    t.is(currentUser(win), user)
  }
)
