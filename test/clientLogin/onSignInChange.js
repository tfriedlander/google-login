import test from 'ava'
import sinon from 'sinon'

import { onSignInChange } from '../../src/clientLogin'

test(
  'returns falsy when window is null',
  t => t.falsy(onSignInChange(() => 1, null))
)

test(
  'returns falsy when no gapi is present',
  t => t.falsy(onSignInChange(() => 1, {}))
)

test(
  'returns falsy when gapi has no auth2 obj',
  t => t.falsy(onSignInChange(() => 1, { gapi: {}}))
)

test(
  'returns falsy when gapi.auth2 has no getAuthInstance obj',
  t => t.falsy(onSignInChange(() => 1, { gapi: { auth2: {} }}))
)

test(
  'returns falsy when gapi.auth2.getAuthInstance returns false',
  t => t.falsy(onSignInChange(() => 1, { gapi: { auth2: { getAuthInstance: () => false }}}))
)

test('returns false when isSignedIn doesnt have a listen function', t => {
  const instance = {
    isSignedIn: {
    }
  }
  const win = {
    gapi: {
      auth2: {
        getAuthInstance: () => instance
      }
    }
  }
  t.is(onSignInChange(() => 1, win), false)
})

test('returns true when listener called', t => {
  const instance = {
    isSignedIn: {
      listen: () => 'hi'
    }
  }
  const win = {
    gapi: {
      auth2: {
        getAuthInstance: () => instance
      }
    }
  }
  t.is(onSignInChange(() => 1, win), true)
})

test('calls isSignedIn.listen', t => {
  const listen = sinon.stub()
  const instance = {
    isSignedIn: {
      listen
    }
  }
  const win = {
    gapi: {
      auth2: {
        getAuthInstance: () => instance
      }
    }
  }
  onSignInChange(() => 1, win)
  t.truthy(listen.calledOnce)
})

test('calls isSignedIn.listen with function sent in', t => {
  const listener = 'howdydoody'
  const listen = sinon.stub()
  const instance = {
    isSignedIn: {
      listen
    }
  }
  const win = {
    gapi: {
      auth2: {
        getAuthInstance: () => instance
      }
    }
  }
  onSignInChange(listener, win)
  t.truthy(listen.calledWith(listener))
})
