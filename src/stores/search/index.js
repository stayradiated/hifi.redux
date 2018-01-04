/* @flow */

import { AsyncValueReducer } from '@stayradiated/mandarin'

import { FETCH_SEARCH_RESULTS } from '../../constants'

import type { ReduxAction } from '../../types'

const searchReducer = new AsyncValueReducer({
  defaultValue: {
    album: { items: [] },
    artist: { items: [] },
    playlist: { items: [] },
    track: { items: [] }
  },
  getValue: (action) => action.value.entities.hubs
})

export default function (state: Object, action: ReduxAction) {
  if (state == null) {
    state = searchReducer.initialState
  }

  switch (action.type) {
    case FETCH_SEARCH_RESULTS.REQUEST:
      return searchReducer.handleRequest(state, action)

    case FETCH_SEARCH_RESULTS.FAILURE:
      return searchReducer.handleFailure(state, action)

    case FETCH_SEARCH_RESULTS.SUCCESS:
      return searchReducer.handleSuccess(state, action)

    default:
      return state
  }
}
