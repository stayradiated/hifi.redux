/* @flow */

import {
  PLAYER_STATE_PAUSED,
  PLAYER_STATE_PLAYING,
  SET_PLAYER_CURRENT_TIME,
  UPDATE_TIMELINE,
  CREATE_QUEUE,
  PLAY_QUEUE_ITEM
} from '../../constants'

import type { ReduxAction, QueueItem } from '../../types'

const initialState = {
  queueItems: (new Map(): Map<string, QueueItem>),
  timeout: null
}

const initialQueueItemState = {
  currentTime: 0,
  playerState: PLAYER_STATE_PAUSED
}

const updateItem = (state, id, fn) => {
  const nextState = {
    ...state,
    queueItems: (new Map(state.queueItems): Map<string, QueueItem>)
  }
  const item = nextState.queueItems.get(id) || initialQueueItemState
  nextState.queueItems.set(id, fn(item))
  return nextState
}

const reducer = (state: Object, action: ReduxAction) => {
  if (state == null) {
    state = initialState
  }

  switch (action.type) {
    case CREATE_QUEUE.REQUEST: {
      const { initialTrackId } = action.payload
      return updateItem(state, initialTrackId, (item) => ({
        ...item,
        playerState: PLAYER_STATE_PLAYING
      }))
    }

    case PLAY_QUEUE_ITEM: {
      const { trackId } = action.payload
      return updateItem(state, trackId, (item) => ({
        ...item,
        playerState: PLAYER_STATE_PLAYING
      }))
    }

    case SET_PLAYER_CURRENT_TIME: {
      const { trackId, currentTime } = action.payload
      return updateItem(state, trackId, (item) => ({
        ...item,
        currentTime
      }))
    }

    case UPDATE_TIMELINE.REQUEST: {
      const { trackId, timeout, playerState } = action.payload
      const nextState = updateItem(state, trackId, (item) => ({
        ...item,
        playerState
      }))

      clearTimeout(state.timeout)
      nextState.timeout = timeout
      return nextState
    }

    default:
      return state
  }
}

export default reducer
