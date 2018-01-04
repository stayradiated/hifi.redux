/* @flow */

import {
  createValueSelector,
  AsyncValueReducer
} from '@stayradiated/mandarin'

import {
  PLEX_AUTHENTICATE
} from '../../constants'

import type { Instance, ReduxAction } from '../../types'

export const authenticatePlex = (username: string, password: string) => ({
  types: PLEX_AUTHENTICATE,
  payload: { username, password },
  meta: {
    plex: ({ account }: Instance) =>
      account.authenticate(username, password).catch(() => {
        throw new Error('Error authenticating with Plex')
      })
  }
})

const asyncReducer = new AsyncValueReducer({
  defaultValue: {}
})

const reducer = (state: Object, action: ReduxAction) => {
  if (state == null) {
    state = asyncReducer.initialState
  }

  switch (action.type) {
    case PLEX_AUTHENTICATE.REQUEST:
      return asyncReducer.handleRequest(state, action)

    case PLEX_AUTHENTICATE.FAILURE:
      return asyncReducer.handleFailure(state, action)

    case PLEX_AUTHENTICATE.SUCCESS:
      return asyncReducer.handleSuccess(state, action)

    default:
      return state
  }
}

const rootSelector = (root) => root.plex.auth

export const selectPlexAuth = createValueSelector(rootSelector)

export default reducer
