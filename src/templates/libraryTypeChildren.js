/* @flow */

import { normalize } from 'perplexed'
import {
  cacheMapList,
  createMapListSelector,
  AsyncMapListReducer
} from '@stayradiated/mandarin'

import type { ReduxAction, ReduxType, Instance } from '../types'

type $createLibraryTypeChildrenStoreOptions = {
  type: number,
  actions: {
    fetch: ReduxType,
    reset: string,
  },
  rootSelector: Function,
  reducerOptions: Object,
  fetchItems?: Function,
}

export default function createLibraryTypeChildrenStore (options: $createLibraryTypeChildrenStoreOptions) {
  const {
    type: TYPE,
    actions: {
      fetch: FETCH_TYPE_CHILDREN,
      reset: RESET_TYPE_CHILDREN
    },
    rootSelector,
    reducerOptions = {},
    fetchItems = ({ library }, id, start, end) =>
      normalize(library.metadataChildren(
        id, TYPE, { start, size: end - start, includeRelated: 1 }))
  } = options

  console.assert(typeof TYPE === 'number', 'type missing')
  console.assert(typeof FETCH_TYPE_CHILDREN === 'object', 'actions.fetch missing')
  console.assert(typeof RESET_TYPE_CHILDREN === 'string', 'actions.reset missing')
  console.assert(typeof rootSelector === 'function', 'rootSelector missing')
  console.assert(typeof reducerOptions === 'object', 'reducerOptions missing')
  console.assert(typeof fetchItems === 'function', 'fetchItems missing')

  const selectors = createMapListSelector(rootSelector)

  const forceFetchTypeChildren = (id: string, start: number, end: number) => ({
    types: FETCH_TYPE_CHILDREN,
    payload: { id, start, end },
    meta: {
      plex: (plex: Instance) => fetchItems(plex, id, start, end)
    }
  })

  const fetchTypeChildren = cacheMapList(
    (id, start = 0, end = 50) => ({
      id,
      range: [start, end],
      selectors,
      dispatch: (range) => forceFetchTypeChildren(
        id, range[0], range[1])
    })
  )

  const resetTypeChildren = (id: string) => ({
    type: RESET_TYPE_CHILDREN,
    payload: { id }
  })

  const asyncReducer = new AsyncMapListReducer({
    getId: (action) => action.payload.id,
    getTotal: (action) => action.value.result.id.totalSize,
    ...reducerOptions
  })

  const reducer = (state: Object, action: ReduxAction) => {
    if (state == null) {
      state = asyncReducer.initialState
    }

    switch (action.type) {
      case RESET_TYPE_CHILDREN:
        return asyncReducer.handleReset(state, action)

      case FETCH_TYPE_CHILDREN.REQUEST:
        return asyncReducer.handleRequest(state, action)

      case FETCH_TYPE_CHILDREN.FAILURE:
        return asyncReducer.handleFailure(state, action)

      case FETCH_TYPE_CHILDREN.SUCCESS:
        return asyncReducer.handleSuccess(state, action)

      default:
        return state
    }
  }

  return {
    reducer,
    fetchTypeChildren,
    forceFetchTypeChildren,
    resetTypeChildren,
    selectors
  }
}
