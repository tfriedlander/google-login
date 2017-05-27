import test from 'ava'
import sinon from 'sinon'

import { loadScript } from '../../src/utils'

test.beforeEach(t => {
  const error = 'unable to create dom object'
  const doc = {
    body: { 
      appendChild: () => {}
    },
    createElement: () => ({
      addEventListener: () => {}
    }),
  }
  t.context = {
    doc,
    error
  }
})

test('returns a promise', t => {
  const val = loadScript('abc', t.context.doc)
  t.truthy(val.then)
})

test('rejects when no document available', t => {
  return t.throws(loadScript('abc', null))
    .then(error => t.is(error.message, t.context.error))
})

test('rejects when no document.createElement available', t => {
  return t.throws(loadScript('abc', {}))
    .then(error => t.is(error.message, t.context.error))
})

test('appends the script to the head when available', t => {
  const head = { appendChild: sinon.spy() }
  const addEventListener = (action, callback, bool) => callback()
  const doc = {
    getElementsByTagName: () => [head],
    createElement: () => ({ addEventListener })
  }
  return loadScript('abc', doc)
    .then(() => t.truthy(head.appendChild.calledOnce))
})

test('appends the script to the body when no head available', t => {
  const body = { appendChild: sinon.spy() }
  const addEventListener = (action, callback, bool) => callback()
  const doc = { 
    body,
    createElement: () => ({ addEventListener })
  }
  return loadScript('abc', doc)
    .then(() => t.truthy(body.appendChild.calledOnce))
})
