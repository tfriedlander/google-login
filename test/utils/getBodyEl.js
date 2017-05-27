import test from 'ava'
import sinon from 'sinon'

import { getBodyEl } from '../../src/utils'

test('returns falsy when no document present', t => {
  t.falsy(getBodyEl(null))
})

test('returns falsy when no body attribute  is present', t => {
  t.falsy(getBodyEl({}))
})

test('returns falsy when no documentElement attribute  is present', t => {
  t.falsy(getBodyEl({}))
})

test('returns the body attribute when present', t => {
  const body = 'hey this is body'
  t.is(getBodyEl({ body }), body)
})

test('returns the documentElement attribute when present', t => {
  const documentElement = 'hey this is docElement'
  t.is(getBodyEl({ documentElement }), documentElement)
})

test('returns the body attribute over the documentElement attribute', t => {
  const body = 'hey this is body'
  const documentElement = 'hey this is docElement'
  t.is(getBodyEl({ body, documentElement }), body)
})
