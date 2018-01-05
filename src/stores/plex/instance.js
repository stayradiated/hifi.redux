/* @flow */

import { createSelector } from 'reselect'
import { Library, ServerConnection } from 'perplexed'
import { actionTypes } from 'redux-localstorage'

import {
  PLEX_INITIALIZE,
  PLEX_USE_SERVER,
  PLEX_READY
} from '../../constants'

import { selectServerStatus } from '../servers/status'

import type { ReduxAction } from '../../types'

const initialState = {
  ready: false,
  client: null,
  account: null,
  serverConnection: null,
  library: null,
  serverId: null
}

const setPlexReady = () => ({
  type: PLEX_READY
})

const usePlexServerConnection = (serverId: number, serverConnection: ServerConnection) => {
  const library = new Library(serverConnection)

  return {
    type: PLEX_USE_SERVER,
    payload: { serverId, serverConnection, library }
  }
}

const usePlexServer = (serverId: number) => {
  return (dispatch: Function, getState: Function) => {
    const state = getState()

    const allStatuses = selectServerStatus.values(state)
    const status = allStatuses.get(serverId)

    if (status != null && status.available) {
      return dispatch(usePlexServerConnection(serverId, status.serverConnection))
    }
  }
}

const clearPlexServerConnection = () => {
  return {
    type: PLEX_USE_SERVER,
    payload: { serverConnection: null, library: null }
  }
}

function reducer (state: Object, action: ReduxAction) {
  if (state == null) {
    state = initialState
  }

  switch (action.type) {
    case actionTypes.INIT:
      return {
        ...state,
        ...((
          action.payload &&
          action.payload.plex &&
          action.payload.plex.instance
        ) || {})
      }

    case PLEX_INITIALIZE:
    case PLEX_USE_SERVER:
      return {
        ...state,
        ...action.payload
      }

    case PLEX_READY:
      return {
        ...state,
        ready: true
      }

    default:
      return state
  }
}

const rootSelector = (state: Object) => state.plex.instance

const selectPlex = {
  root: rootSelector,
  ready: createSelector(rootSelector, (root) => root.ready),
  account: createSelector(rootSelector, (root) => root.account),
  client: createSelector(rootSelector, (root) => root.client),
  library: createSelector(rootSelector, (root) => root.library),
  serverConnection: createSelector(rootSelector, (root) => root.serverConnection),
  serverId: createSelector(rootSelector, (root) => root.serverId)
}

export {
  clearPlexServerConnection,
  selectPlex,
  setPlexReady,
  usePlexServer,
  usePlexServerConnection
}

export default reducer
