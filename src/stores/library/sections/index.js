// @flow

import { actionTypes } from 'redux-localstorage'
import { AsyncValueReducer } from '@stayradiated/mandarin'

import { rehydrateValueReducer } from '../../../utils'
import { FETCH_LIBRARY_SECTIONS } from '../../../constants'

import type { ReduxAction } from '../../../types'

const asyncReducer = new AsyncValueReducer({
  defaultValue: [],
  getValue: (action) => action.value.sections
})

const reducer = (state: Object, action: ReduxAction) => {
  if (state == null) {
    state = asyncReducer.initialState
  }

  switch (action.type) {
    case actionTypes.INIT:
      return rehydrateValueReducer(state, action.payload, [
        'library',
        'sections'
      ])

    case FETCH_LIBRARY_SECTIONS.REQUEST:
      return asyncReducer.handleRequest(state, action)

    case FETCH_LIBRARY_SECTIONS.FAILURE:
      return asyncReducer.handleFailure(state, action)

    case FETCH_LIBRARY_SECTIONS.SUCCESS:
      return asyncReducer.handleSuccess(state, action)

    default:
      return state
  }
}

export default reducer
