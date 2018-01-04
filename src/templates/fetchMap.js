/* @flow */

import {
  cacheMap,
  AsyncMapReducer,
  createMapSelector
} from '@stayradiated/mandarin'

import type { ReduxType, ReduxAction } from '../types'

type Options = {
  constant: ReduxType,
  rootSelector: Function,
  forceFetch: Function,
  getCacheOptions: () => Object,
  reducerOptions?: Object,
}

export default function createFetchMapStore (options: Options) {
  const {
    constant: TYPE,
    rootSelector,
    forceFetch,
    getCacheOptions = () => ({}),
    reducerOptions = {}
  } = options

  const selectors = createMapSelector(rootSelector)

  const fetchMap = cacheMap((...args) => ({
    dispatch: forceFetch,
    selectors,
    ...getCacheOptions(...args)
  }))

  const asyncReducer = new AsyncMapReducer(reducerOptions)

  const reducer = (state: Object, action: ReduxAction) => {
    if (state == null) {
      state = asyncReducer.initialState
    }

    switch (action.type) {
      case TYPE.REQUEST:
        return asyncReducer.handleRequest(state, action)

      case TYPE.FAILURE:
        return asyncReducer.handleFailure(state, action)

      case TYPE.SUCCESS:
        return asyncReducer.handleSuccess(state, action)

      default:
        return state
    }
  }

  return {
    reducer,
    fetchMap,
    forceFetch,
    selectors
  }
}
