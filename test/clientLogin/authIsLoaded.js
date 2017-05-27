import test from 'ava'

import { authIsLoaded } from '../../src/clientLogin'

test(
  'returns false when window is null',
  t => t.is(authIsLoaded(null), false)
)

test(
  'returns false when no gapi is present',
  t => t.is(authIsLoaded({}), false)
)

test(
  'returns false when gapi has no auth2 obj',
  t => t.is(authIsLoaded({ gapi: {}}), false)
)

test(
  'returns false when gapi.auth2 has no getAuthInstance obj',
  t => t.is(authIsLoaded({ gapi: { auth2: {} }}), false)
)

test(
  'returns false when gapi.auth2.getAuthInstance returns false',
  t => t.is(authIsLoaded({ gapi: { auth2: { getAuthInstance: () => false }}}), false)
)

test(
  'returns true when gapi.auth2.getAuthInstance returns truthy',
  t => t.is(authIsLoaded({ gapi: { auth2: { getAuthInstance: () => 'hi'}}}), true)
)
