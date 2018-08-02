import test from 'ava'
import sinon from 'sinon'

import { createScriptObj } from '../../src/utils'

test.beforeEach(t => {
  const error = 'unable to create dom object'
  t.context = {
    error
  }
})

test('throws error when no doc object provided', t => {
  const error = t.throws(
    () => {
      createScriptObj('asdf', () => {}, null)
    },
    Error
  )
  t.is(error.message, t.context.error)
})

test('throws error when no doc.createElement available', t => {
  const error = t.throws(
    () => {
      createScriptObj('asdf', () => {}, {})
    },
    Error
  )
  t.is(error.message, t.context.error)
})

test('returns script dom element created', t => {
  const script = { addEventListener: sinon.spy() }
  const createElement = sinon.stub().returns(script)
  const doc = { createElement }
  t.is(createScriptObj('asdf', () => {}, doc), script)
})

test('returns script dom element with expected src', t => {
  const src = 'http://abc.com'
  const script = { addEventListener: sinon.spy() }
  const createElement = sinon.stub().returns(script)
  const doc = { createElement }
  t.is(createScriptObj(src, () => {}, doc).src, src)
})

test('returns script dom element with type text/javascript', t => {
  const src = 'http://abc.com'
  const script = { addEventListener: sinon.spy() }
  const createElement = sinon.stub().returns(script)
  const doc = { createElement }
  t.is(createScriptObj(src, () => {}, doc).type, 'text/javascript')
})

test('adds load listener to script object', t => {
  const src = 'http://abc.com'
  const script = { addEventListener: sinon.spy() }
  const createElement = sinon.stub().returns(script)
  const doc = { createElement }
  createScriptObj(src, () => {}, doc)
  t.truthy(script.addEventListener.calledWith('load', sinon.match.any, sinon.match.any))
})

test('adds load listener to script object with callback', t => {
  const src = 'http://abc.com'
  const script = { addEventListener: sinon.spy() }
  const createElement = sinon.stub().returns(script)
  const doc = { createElement }
  const callbackFn = 'super duper callback'
  createScriptObj(src, callbackFn, doc)
  t.truthy(script.addEventListener.calledWith(sinon.match.any, callbackFn, sinon.match.any))
})

test('adds load listener to script object with useCapture false', t => {
  const src = 'http://abc.com'
  const script = { addEventListener: sinon.spy() }
  const createElement = sinon.stub().returns(script)
  const doc = { createElement }
  createScriptObj(src, () => {}, doc)
  t.truthy(script.addEventListener.calledWith(sinon.match.any, sinon.match.any, false))
})
