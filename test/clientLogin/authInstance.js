import test from 'ava'

import { authInstance } from '../../src/clientLogin'

test(
  'returns falsy when window is null',
  t => t.falsy(authInstance(null))
)

test(
  'returns falsy when no gapi is present',
  t => t.falsy(authInstance({}))
)

test(
  'returns falsy when gapi has no auth2 obj',
  t => t.falsy(authInstance({ gapi: {}}))
)

test(
  'returns falsy when gapi.auth2 has no getAuthInstance obj',
  t => t.falsy(authInstance({ gapi: { auth2: {} }}))
)

test(
  'returns falsy when gapi.auth2.getAuthInstance returns false',
  t => t.falsy(authInstance({ gapi: { auth2: { getAuthInstance: () => false }}}))
)

test(
  'returns auth object',
  t => {
    const instance = 'howdy'
    const win = {
      gapi: {
        auth2: {
          getAuthInstance: () => instance
        }
      }
    }
    t.is(authInstance(win), instance)
  }
)
