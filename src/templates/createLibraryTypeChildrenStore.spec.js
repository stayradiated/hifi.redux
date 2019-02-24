import test from 'ava'
import { c } from '@stayradiated/mandarin'

import createLibraryTypeChildrenStore from './createLibraryTypeChildrenStore'

const FETCH = c('FETCH')
const RESET = c('RESET')
const MOVE = c('MOVE')
const REMOVE = c('REMOVE')
const ADD = c('ADD')

const DEFAULT_OPTIONS = {
  type: 0,
  actions: {
    fetch: FETCH,
    reset: RESET,
    move: MOVE,
    remove: REMOVE,
    add: ADD
  },
  rootSelector: () => null,
  reducerOptions: {}
}

test('create store', (t) => {
  const store = createLibraryTypeChildrenStore(DEFAULT_OPTIONS)

  t.is(typeof store.reducer, 'function')
  t.is(typeof store.fetchTypeChildren, 'function')
  t.is(typeof store.forceFetchTypeChildren, 'function')
  t.is(typeof store.resetTypeChildren, 'function')
  t.is(typeof store.selectors, 'object')
  t.is(typeof store.selectors.errors, 'function')
  t.is(typeof store.selectors.fetched, 'function')
  t.is(typeof store.selectors.promises, 'function')
  t.is(typeof store.selectors.total, 'function')
  t.is(typeof store.selectors.values, 'function')
})

test('actions: MOVE.REQUEST', (t) => {
  const store = createLibraryTypeChildrenStore(DEFAULT_OPTIONS)

  const state = {
    values: new Map([[0, [0, 1, 2, 3]]])
  }

  const action = {
    type: MOVE.REQUEST,
    payload: { id: 0, oldIndex: 1, newIndex: 2 }
  }

  const nextState = store.reducer(state, action)

  t.deepEqual(nextState, {
    values: new Map([[0, [0, 2, 1, 3]]])
  })
})

test('actions: REMOVE.REQUEST', (t) => {
  const store = createLibraryTypeChildrenStore(DEFAULT_OPTIONS)

  const state = {
    values: new Map([[0, [{ id: 10 }, { id: 20 }, { id: 30 }]]])
  }

  const action = {
    type: REMOVE.REQUEST,
    payload: { id: 0, itemId: 20 }
  }

  const nextState = store.reducer(state, action)

  t.deepEqual(nextState, {
    values: new Map([[0, [{ id: 10 }, { id: 30 }]]])
  })
})
