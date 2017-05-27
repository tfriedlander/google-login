import test from 'ava'

import { isSignedIn } from '../../src/clientLogin'

test(
  'returns falsy when window is null',
  t => t.falsy(isSignedIn(null))
)

test(
  'returns falsy when no gapi is present',
  t => t.falsy(isSignedIn({}))
)

test(
  'returns falsy when gapi has no auth2 obj',
  t => t.falsy(isSignedIn({ gapi: {}}))
)

test(
  'returns falsy when gapi.auth2 has no getAuthInstance obj',
  t => t.falsy(isSignedIn({ gapi: { auth2: {} }}))
)

test(
  'returns falsy when gapi.auth2.getAuthInstance returns false',
  t => t.falsy(isSignedIn({ gapi: { auth2: { getAuthInstance: () => false }}}))
)

test('returns true when signed in', t => {
  const instance = {
    isSignedIn: {
      get: () => true
    }
  }
  const win = {
    gapi: {
      auth2: {
        getAuthInstance: () => instance
      }
    }
  }
  t.is(isSignedIn(win), true)
})

test('returns false when not signed in', t => {
  const instance = {
    isSignedIn: {
      get: () => false
    }
  }
  const win = {
    gapi: {
      auth2: {
        getAuthInstance: () => instance
      }
    }
  }
  t.is(isSignedIn(win), false)
})
