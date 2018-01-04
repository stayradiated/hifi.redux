/* @flow */

import { createSelector } from 'reselect'
import { normalize } from 'perplexed'
import {
  AsyncMapListReducer,
  cacheMapList,
  createListSelector
} from '@stayradiated/mandarin'

import type { Dispatch, GetState, ReduxAction, ReduxType } from '../types'

type $createLibraryTypeListOptions = {
  type: number,
  actions: {
    fetch: ReduxType,
    sort: string,
    reset: string,
  },
  sort: {
    default: string,
    descending: boolean,
    options: { [string]: string },
  },
  rootSelector: Function,
  reducerOptions: Object,
  fetchItems?: Function,
}

export default function createLibraryTypeList (options: $createLibraryTypeListOptions) {
  const {
    type: TYPE,
    actions: {
      fetch: FETCH_LIBRARY_TYPE,
      sort: SORT_LIBRARY_TYPE,
      reset: RESET_LIBRARY_TYPE
    },
    sort: {
      default: defaultSortBy,
      descending: defaultSortDesc,
      options: sortOptions
    },
    rootSelector,
    reducerOptions = {},
    fetchItems = ({ library }, section, params) =>
      normalize(library.sectionItems(section, TYPE, params))
  } = options

  console.assert(typeof TYPE === 'number', 'type missing')
  console.assert(typeof FETCH_LIBRARY_TYPE === 'object', 'actions.fetch missing')
  console.assert(typeof SORT_LIBRARY_TYPE === 'string', 'actions.sort missing')
  console.assert(typeof RESET_LIBRARY_TYPE === 'string', 'actions.reset missing')
  console.assert(typeof defaultSortBy === 'string', 'sort.default missing')
  console.assert(typeof defaultSortDesc === 'boolean', 'sort.descending missing')
  console.assert(typeof sortOptions === 'object', 'sort.options missing')
  console.assert(typeof rootSelector === 'function', 'rootSelector missing')
  console.assert(typeof reducerOptions === 'object', 'reducerOptions missing')
  console.assert(typeof fetchItems === 'function', 'fetchItems missing')

  const selectors = createListSelector(rootSelector)

  selectors.sortKey = createSelector(rootSelector, (root) => {
    return root.sortOptions[root.sortBy][root.sortDesc ? 1 : 0]
  })

  selectors.sortBy = createSelector(rootSelector, (root) =>
    root.sortBy)

  selectors.sortDesc = createSelector(rootSelector, (root) =>
    root.sortDesc)

  selectors.sortOptions = createSelector(rootSelector, (root) =>
    Object.keys(root.sortOptions))

  const forceFetchLibraryTypeRange = (section: string, start: number, end: number) =>
    (dispatch: Dispatch, getState: GetState) => {
      const sort = selectors.sortKey(getState())
      const params = { start, size: end - start, sort }

      return dispatch({
        types: FETCH_LIBRARY_TYPE,
        payload: { section, start, end },
        meta: {
          plex: (plex) => fetchItems(plex, section, params)
        }
      })
    }

  const fetchLibraryTypeRange = cacheMapList(
    (section, start, end) => ({
      id: section,
      range: [start, end],
      selectors,
      dispatch: (range) => {
        return forceFetchLibraryTypeRange(
          section, range[0], range[1])
      }
    })
  )

  const resetLibraryType = (section: string) => ({
    type: RESET_LIBRARY_TYPE,
    payload: { section }
  })

  const sortLibraryType = (sortBy: string, sortDesc: boolean) => ({
    type: SORT_LIBRARY_TYPE,
    payload: { sortBy, sortDesc }
  })

  const asyncReducer = new AsyncMapListReducer({
    getId: (action) => action.payload.section,
    getTotal: (action) => action.value.result.id.totalSize,
    ...reducerOptions
  })

  const initialState = {
    ...asyncReducer.initialState,
    sortBy: defaultSortBy,
    sortDesc: defaultSortDesc,
    sortOptions
  }

  const reducer = (state: Object, action: ReduxAction) => {
    if (state == null) {
      state = initialState
    }

    switch (action.type) {
      case FETCH_LIBRARY_TYPE.REQUEST:
        return asyncReducer.handleRequest(state, action)

      case FETCH_LIBRARY_TYPE.FAILURE:
        return asyncReducer.handleFailure(state, action)

      case FETCH_LIBRARY_TYPE.SUCCESS:
        return asyncReducer.handleSuccess(state, action)

      case SORT_LIBRARY_TYPE:
        const { sortBy, sortDesc } = action.payload
        return {
          ...initialState,
          sortBy,
          sortDesc
        }

      case RESET_LIBRARY_TYPE:
        return asyncReducer.handleReset(state, action)

      default:
        return state
    }
  }

  return {
    fetchLibraryTypeRange,
    forceFetchLibraryTypeRange,
    reducer,
    resetLibraryType,
    selectors,
    sortLibraryType
  }
}
