/* @flow */

import { actionTypes } from 'redux-localstorage'
import { AsyncValueReducer } from '@stayradiated/mandarin'

import { rehydrateValueReducer } from '../../../utils'
import { FETCH_LIBRARY_SECTIONS } from '../../../constants'

import type { ReduxAction } from '../../../types'

const reducer = new AsyncValueReducer({
  defaultValue: [],
  getValue: (action) => action.value.sections
})

export default function (state: Object, action: ReduxAction) {
  if (state == null) {
    state = reducer.initialState
  }

  switch (action.type) {
    case actionTypes.INIT:
      return rehydrateValueReducer(state, action.payload, ['library', 'sections'])

    case FETCH_LIBRARY_SECTIONS.REQUEST:
      return reducer.handleRequest(state, action)

    case FETCH_LIBRARY_SECTIONS.FAILURE:
      return reducer.handleFailure(state, action)

    case FETCH_LIBRARY_SECTIONS.SUCCESS:
      return reducer.handleSuccess(state, action)

    default:
      return state
  }
}
