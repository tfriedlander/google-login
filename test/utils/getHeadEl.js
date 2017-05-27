import test from 'ava'
import sinon from 'sinon'

import { getHeadEl } from '../../src/utils'

test.beforeEach(t => {
  const expectedEl = 'this is the expected el'
  const docWithHead = {
    getElementsByTagName: () => [expectedEl]
  }
  const docWithoutHead = {
    getElementsByTagName: () => []
  }
  t.context = { expectedEl, docWithHead, docWithoutHead }
})

test('returns null when no document present', t => {
  t.is(getHeadEl(null), null)
})

test('returns null when no getElementsByTagName func is present', t => {
  t.is(getHeadEl({}), null)
})

test('returns falsy when no head element present', t => {
  t.falsy(getHeadEl(t.context.docWithoutHead))
})

test('returns expected element', t => {
  t.is(getHeadEl(t.context.docWithHead), t.context.expectedEl)
})
