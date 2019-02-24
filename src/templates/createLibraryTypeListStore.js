// @flow

import { createSelector } from 'reselect'
import { normalize } from 'perplexed'
import {
  AsyncMapListReducer,
  cacheMapList,
  createListSelector
} from '@stayradiated/mandarin'

import { selectLibrarySectionId } from '../stores/ui'

import type { Dispatch, GetState, ReduxAction, ReduxType } from '../types'

type $createLibraryTypeListStoreOptions = {
  type: number,
  actions: {
    fetch: ReduxType,
    sort: string,
    reset: string,
    filter?: string
  },
  sort: {
    default: string,
    descending: boolean,
    options: { [string]: string }
  },
  rootSelector: Function,
  reducerOptions: Object,
  fetchItems?: Function
}

export default function createLibraryTypeListStore (
  options: $createLibraryTypeListStoreOptions
) {
  const {
    type: TYPE,
    actions: {
      fetch: FETCH_LIBRARY_TYPE,
      sort: SORT_LIBRARY_TYPE,
      reset: RESET_LIBRARY_TYPE,
      filter: FILTER_LIBRARY_TYPE
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
  console.assert(
    typeof FETCH_LIBRARY_TYPE === 'object',
    'actions.fetch missing'
  )
  console.assert(typeof SORT_LIBRARY_TYPE === 'string', 'actions.sort missing')
  console.assert(
    typeof RESET_LIBRARY_TYPE === 'string',
    'actions.reset missing'
  )
  console.assert(typeof defaultSortBy === 'string', 'sort.default missing')
  console.assert(
    typeof defaultSortDesc === 'boolean',
    'sort.descending missing'
  )
  console.assert(typeof sortOptions === 'object', 'sort.options missing')
  console.assert(typeof rootSelector === 'function', 'rootSelector missing')
  console.assert(typeof reducerOptions === 'object', 'reducerOptions missing')
  console.assert(typeof fetchItems === 'function', 'fetchItems missing')

  const selectors = createListSelector(rootSelector)

  selectors.currentIds = createSelector(
    selectLibrarySectionId,
    selectors.values,
    (sectionId, values) => values.get(sectionId) || []
  )

  selectors.sortKey = createSelector(rootSelector, (root) => {
    return root.sortOptions[root.sortBy][root.sortDesc ? 1 : 0]
  })

  selectors.filter = createSelector(rootSelector, (root) => {
    return root.filter
  })

  selectors.sortBy = createSelector(rootSelector, (root) => root.sortBy)

  selectors.sortDesc = createSelector(rootSelector, (root) => root.sortDesc)

  selectors.sortOptions = createSelector(rootSelector, (root) =>
    Object.keys(root.sortOptions)
  )

  const forceFetchLibraryTypeRange = (
    section: string,
    start: number,
    end: number
  ) => (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const sort = selectors.sortKey(state)
    const filter = selectors.filter(state)

    const params = {
      start,
      size: end - start,
      sort,
      ...filter
    }

    return dispatch({
      types: FETCH_LIBRARY_TYPE,
      payload: { section, start, end, params },
      meta: {
        plex: (plex) => fetchItems(plex, section, params)
      }
    })
  }

  const fetchLibraryTypeRange = cacheMapList((section, start, end) => ({
    id: section,
    range: [start, end],
    selectors,
    dispatch: (range) => {
      return forceFetchLibraryTypeRange(section, range[0], range[1])
    }
  }))

  const fetchCurrentLibraryTypeRange = (start: number, end: number) => {
    return (dispatch: Dispatch, getState: GetState) => {
      const sectionId = selectLibrarySectionId(getState())
      return dispatch(fetchLibraryTypeRange(sectionId, start, end))
    }
  }

  const resetLibraryType = (section: string) => ({
    type: RESET_LIBRARY_TYPE,
    payload: { section }
  })

  const resetCurrentLibraryType = () => {
    return (dispatch: Dispatch, getState: GetState) => {
      const sectionId = selectLibrarySectionId(getState())
      return dispatch(resetLibraryType(sectionId))
    }
  }

  const sortLibraryType = (sortBy: string, sortDesc: boolean) => ({
    type: SORT_LIBRARY_TYPE,
    payload: { sortBy, sortDesc }
  })

  const filterLibraryType = (filter: { [string]: string }) => ({
    type: FILTER_LIBRARY_TYPE,
    payload: { filter }
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
    sortOptions,
    filter: {}
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
          filter: state.filter,
          sortBy,
          sortDesc
        }

      case RESET_LIBRARY_TYPE:
        return asyncReducer.handleReset(state, action)

      case FILTER_LIBRARY_TYPE:
        const { filter } = action.payload
        return {
          ...initialState,
          sortBy: state.sortBy,
          sortDesc: state.sortDesc,
          filter
        }

      default:
        return state
    }
  }

  return {
    fetchLibraryTypeRange,
    forceFetchLibraryTypeRange,
    fetchCurrentLibraryTypeRange,
    reducer,
    resetLibraryType,
    resetCurrentLibraryType,
    selectors,
    sortLibraryType,
    filterLibraryType
  }
}
