import test from 'ava'

import { userId } from '../../src/clientLogin'

test(
  'returns falsy when window is null',
  t => t.falsy(userId(null))
)

test(
  'returns falsy when no gapi is present',
  t => t.falsy(userId({}))
)

test(
  'returns falsy when gapi has no auth2 obj',
  t => t.falsy(userId({ gapi: {}}))
)

test(
  'returns falsy when gapi.auth2 has no getAuthInstance obj',
  t => t.falsy(userId({ gapi: { auth2: {} }}))
)

test(
  'returns falsy when gapi.auth2.getAuthInstance returns false',
  t => t.falsy(userId({ gapi: { auth2: { getAuthInstance: () => false }}}))
)

test(
  'returns falsy when authInstance has no currentUser',
  t => t.falsy(userId({ gapi: { auth2: { getAuthInstance: () => {}}}}))
)

test('returns current user id when', t => {
  const myId = 'abc123' 
  const user = { getId: () => myId }
  const instance = { currentUser: { get: () => user }}
  const win = {
    gapi: {
      auth2: {
        getAuthInstance: () => instance
      }
    }
  }
  t.is(userId(win), myId)
})
