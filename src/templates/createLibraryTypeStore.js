// @flow

import { normalize } from 'perplexed'
import {
  AsyncMapReducer,
  createObjectMergeFunction,
  cacheMap,
  createMapSelector
} from '@stayradiated/mandarin'

import type { ReduxAction, ReduxType, Instance } from '../types'

type $createLibraryTypeStoreOptions = {
  entity: string,
  libraryType?: number,
  actions: {
    fetch: ReduxType
  },
  rootSelector: Function,
  mergeActions?: Array<string>,
  customActions?: Object,
  fetchItems?: Function
}

export default function createLibraryTypeStore (
  options: $createLibraryTypeStoreOptions
) {
  const {
    entity,
    libraryType,
    actions: { fetch: FETCH_TYPE },
    rootSelector,
    mergeActions = [],
    customActions = {},
    fetchItems = ({ library }, id) =>
      normalize(library.metadata(id, libraryType))
  } = options

  const selectors = createMapSelector(rootSelector)

  const forceFetchType = (id: string) => ({
    types: FETCH_TYPE,
    payload: { id },
    meta: {
      plex: (plex: Instance) => fetchItems(plex, id)
    }
  })

  const containsRequiredAttributes = (map, requiredAttributes = []) =>
    requiredAttributes.every(
      (attribute) => map.has(attribute) && map.get(attribute) != null
    )

  const fetchType = cacheMap((id, required) => ({
    id,
    selectors,
    dispatch: forceFetchType,
    validate: (item) => containsRequiredAttributes(item, required)
  }))

  const asyncReducer = new AsyncMapReducer({
    getId: (action) => action.payload.id,
    getValue: (action) => {
      const { id } = action.payload
      const { entities } = action.value
      return entities[entity][id]
    }
  })

  const mergeItems = createObjectMergeFunction({
    getId: (item) => item.id
  })

  const reducer = (state: Object, action: ReduxAction) => {
    if (state == null) {
      state = asyncReducer.initialState
    }

    switch (action.type) {
      case FETCH_TYPE.REQUEST:
        return asyncReducer.handleRequest(state, action)

      case FETCH_TYPE.FAILURE:
        return asyncReducer.handleFailure(state, action)

      case FETCH_TYPE.SUCCESS:
        return asyncReducer.handleSuccess(state, action)

      default:
        if (mergeActions.includes(action.type)) {
          const entityValues = action.value.entities[entity]

          return {
            ...state,
            values: mergeItems(state.values, entityValues)
          }
        }
        for (const key of Object.keys(customActions)) {
          if (key === action.type) {
            return customActions[key](state, action)
          }
        }
        return state
    }
  }

  return {
    reducer,
    forceFetchType,
    fetchType,
    selectors
  }
}
