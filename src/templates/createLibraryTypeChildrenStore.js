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
    move?: ReduxType,
    remove?: ReduxType,
    add?: ReduxType
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
      reset: RESET_TYPE_CHILDREN,
      move: MOVE_TYPE_CHILDREN,
      remove: REMOVE_TYPE_CHILDREN,
      add: ADD_TYPE_CHILDREN
    },
    rootSelector,
    reducerOptions = {},
    fetchItems = ({ library }, id, start, end) =>
      normalize(library.metadataChildren(
        id, TYPE, { start, size: end - start, includeRelated: 1 }))
  } = options

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

  const handleMove = (state, action) => {
    const { oldIndex, newIndex } = action.payload

    return asyncReducer.modifyItemValues(state, action, (valueList) => {
      const item = valueList[oldIndex]
      valueList.splice(oldIndex, 1)
      valueList.splice(newIndex, 0, item)
      return valueList
    })
  }

  const handleRemove = (state, action) => {
    const { itemId } = action.payload

    return asyncReducer.modifyItemValues(state, action, (valueList) => {
      const index = valueList.findIndex((item) => item.id === itemId)
      valueList.splice(index, 1)
      return valueList
    })
  }

  const handleAdd = (state, action) => {
    const { trackId } = action.payload

    return asyncReducer.modifyItemValues(state, action, (valueList, playlistId) => {
      valueList.push({
        id: 0,
        playlistId,
        track: trackId,
        _type: 'playlistItem'
      })
      return valueList
    })
  }

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

      case MOVE_TYPE_CHILDREN && MOVE_TYPE_CHILDREN.REQUEST:
        return handleMove(state, action)

      case REMOVE_TYPE_CHILDREN && REMOVE_TYPE_CHILDREN.REQUEST:
        return handleRemove(state, action)

      case ADD_TYPE_CHILDREN && ADD_TYPE_CHILDREN.REQUEST:
        return handleAdd(state, action)

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
