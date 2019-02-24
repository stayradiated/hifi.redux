// @flow

import { createSelector } from 'reselect'
import { actionTypes } from 'redux-localstorage'

import {
  UI_SET_DISPLAY_QUEUE,
  UI_SET_DISPLAY_PLAYER,
  UI_SET_TRACK_TO_ADD_TO_PLAYLIST,
  UI_SET_LIBRARY_SECTION_ID
} from '../../constants'

import type { Dispatch, GetState, ReduxAction } from '../../types'

const initialState = {
  librarySectionId: null,
  displayQueue: false,
  displayPlayer: false,
  trackToAddToPlaylist: null
}

const root = (state) => state.ui
const selectLibrarySectionId = createSelector(
  root,
  (_root) => _root.librarySectionId
)
const selectDisplayQueue = createSelector(root, (_root) => _root.displayQueue)
const selectDisplayPlayer = createSelector(root, (_root) => _root.displayPlayer)
const selectTrackToAddToPlaylist = createSelector(
  root,
  (_root) => _root.trackToAddToPlaylist
)

/**
 * DISPLAY QUEUE
 */

const setDisplayQueue = (value: boolean) => ({
  type: UI_SET_DISPLAY_QUEUE,
  payload: value
})

const toggleDisplayQueue = () => (dispatch: Dispatch, getState: GetState) =>
  dispatch(setDisplayQueue(!selectDisplayQueue(getState())))

/**
 * DISPLAY PLAYER
 */

const setDisplayPlayer = (value: boolean) => ({
  type: UI_SET_DISPLAY_PLAYER,
  payload: value
})

const toggleDisplayPlayer = () => (dispatch: Dispatch, getState: GetState) =>
  dispatch(setDisplayPlayer(!selectDisplayPlayer(getState())))

/**
 * ADD TO PLAYLIST
 */

const setTrackToAddToPlaylist = (trackId: string) => ({
  type: UI_SET_TRACK_TO_ADD_TO_PLAYLIST,
  payload: trackId
})

/**
 * LIBRARY SECTION ID
 */

const setLibrarySectionId = (librarySectionId: number) => {
  return {
    type: UI_SET_LIBRARY_SECTION_ID,
    payload: librarySectionId
  }
}

/**
 * REDUCER
 */

const reducer = (state: Object, action: ReduxAction) => {
  if (state == null) {
    state = initialState
  }

  switch (action.type) {
    case actionTypes.INIT:
      return {
        ...state,
        ...((action.payload && action.payload.ui) || {})
      }

    case UI_SET_DISPLAY_QUEUE:
      return {
        ...state,
        displayQueue: action.payload
      }
    case UI_SET_DISPLAY_PLAYER:
      return {
        ...state,
        displayPlayer: action.payload
      }
    case UI_SET_TRACK_TO_ADD_TO_PLAYLIST:
      return {
        ...state,
        trackToAddToPlaylist: action.payload
      }
    case UI_SET_LIBRARY_SECTION_ID:
      return {
        ...state,
        librarySectionId: action.payload
      }
    default:
      return state
  }
}

export {
  setDisplayQueue,
  toggleDisplayQueue,
  setDisplayPlayer,
  toggleDisplayPlayer,
  setTrackToAddToPlaylist,
  setLibrarySectionId,
  selectDisplayPlayer,
  selectDisplayQueue,
  selectTrackToAddToPlaylist,
  selectLibrarySectionId
}

export default reducer
