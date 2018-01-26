/* @flow */

import {
  createObjectMergeFunction,
  createMapSelector
} from '@stayradiated/mandarin'

import type { ReduxAction } from '../types'

type Options = {
  constants: [string],
  entity: string,
  rootSelector: Function,
  mergeOptions: Object,
}

export default function createPassiveMapStore (options: Options) {
  const {
    constants,
    entity,
    rootSelector,
    mergeOptions = {}
  } = options

  const selectors = createMapSelector(rootSelector)

  const mergeItems = createObjectMergeFunction(mergeOptions)

  const initialState = {
    values: (new Map(): Map<any, any>)
  }

  const reducer = (state: Object, action: ReduxAction) => {
    if (state == null) {
      state = initialState
    }

    if (constants.includes(action.type)) {
      return {
        ...state,
        values: mergeItems(state.values, action.value.entities[entity])
      }
    }
    return state
  }

  return {
    reducer,
    selectors
  }
}
