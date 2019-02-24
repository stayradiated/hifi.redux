// @flow

import test from 'ava'

import createRootReducer from './index'

test('exports root reducer', (t) => {
  createRootReducer({
    reducers: {}
  })
  t.pass()
})
