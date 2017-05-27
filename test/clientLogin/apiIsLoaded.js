import test from 'ava'

import { apiIsLoaded } from '../../src/clientLogin'

test(
  'returns false when window is null',
  t => t.is(apiIsLoaded(null), false)
)

test(
  'returns false when no gapi is present',
  t => t.is(apiIsLoaded({}), false)
)

test(
  'returns false when gapi has no auth2 obj',
  t => t.is(apiIsLoaded({ gapi: {}}), false)
)

test(
  'returns true when gapi has an auth2 obj',
  t => t.is(apiIsLoaded({ gapi: { auth2: 'hi'}}), true)
)
