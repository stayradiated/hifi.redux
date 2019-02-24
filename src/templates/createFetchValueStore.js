// @flow

import {
  cacheValue,
  AsyncValueReducer,
  createValueSelector
} from '@stayradiated/mandarin'

import type { ReduxType, ReduxAction } from '../types'

type $createFetchValueStoreOptions = {
  constant: ReduxType,
  rootSelector: Function,
  getActionOptions: Function,
  reducerOptions: Object
}

export default function createFetchValueStore (
  options: $createFetchValueStoreOptions
) {
  const {
    constant: TYPE,
    rootSelector,
    getActionOptions = () => ({}),
    reducerOptions = {}
  } = options

  const selectors = createValueSelector(rootSelector)

  const forceFetchValue = (...args: any) => ({
    types: TYPE,
    ...getActionOptions(...args)
  })

  const fetchValue = cacheValue(() => ({
    dispatch: forceFetchValue,
    selectors
  }))

  const asyncReducer = new AsyncValueReducer(reducerOptions)

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
    fetchValue,
    forceFetchValue,
    selectors
  }
}
