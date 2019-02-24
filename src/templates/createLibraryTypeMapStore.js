// @flow

import {
  AsyncMapReducer,
  cacheMap,
  createMapSelector
} from '@stayradiated/mandarin'

import { selectLibrarySectionId } from '../stores/ui'

import type {
  Instance,
  Dispatch,
  GetState,
  ReduxAction,
  ReduxType
} from '../types'

type $createLibraryTypeMapStoreOptions = {
  actions: {
    fetch: ReduxType
  },
  rootSelector: Function,
  fetchItems: Function
}

export default function createLibraryTypeMapStore (
  options: $createLibraryTypeMapStoreOptions
) {
  const {
    actions: { fetch: FETCH_LIBRARY_TYPE },
    rootSelector,
    fetchItems
  } = options

  const selectors = createMapSelector(rootSelector)

  const forceFetchLibraryType = (sectionId: string) => ({
    types: FETCH_LIBRARY_TYPE,
    payload: { sectionId },
    meta: {
      plex: (plex: Instance) => fetchItems(plex, sectionId)
    }
  })

  const fetchLibraryType = cacheMap((sectionId) => ({
    id: sectionId,
    selectors,
    dispatch: forceFetchLibraryType
  }))

  const fetchCurrentLibraryType = () => {
    return (dispatch: Dispatch, getState: GetState) => {
      const sectionId = selectLibrarySectionId(getState())
      return dispatch(fetchLibraryType(sectionId))
    }
  }

  const asyncReducer = new AsyncMapReducer({
    getId: (action) => action.payload.sectionId
  })

  const reducer = (state: Object, action: ReduxAction) => {
    if (state == null) {
      state = asyncReducer.initialState
    }

    switch (action && action.type) {
      case FETCH_LIBRARY_TYPE.REQUEST:
        return asyncReducer.handleRequest(state, action)

      case FETCH_LIBRARY_TYPE.FAILURE:
        return asyncReducer.handleFailure(state, action)

      case FETCH_LIBRARY_TYPE.SUCCESS:
        return asyncReducer.handleSuccess(state, action)

      default:
        return state
    }
  }

  return {
    fetchLibraryType,
    forceFetchLibraryType,
    fetchCurrentLibraryType,
    reducer,
    selectors
  }
}
