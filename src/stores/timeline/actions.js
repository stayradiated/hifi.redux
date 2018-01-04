/* @flow */

import {
  SET_PLAYER_CURRENT_TIME,
  UPDATE_TIMELINE,
  CONFIG_TIMELINE_UPDATE_TIME,
  PLAYER_STATE_STOPPED,
  PLAYER_STATE_PAUSED,
  PLAYER_STATE_PLAYING
} from '../../constants'

import * as selectTimeline from './selectors'
import { selectAllTracks } from '../tracks/all'

import type { Dispatch, GetState, QueueItem, Instance } from '../../types'

type $updateTimelineOptions = {
}

const updateTimeline = (options: $updateTimelineOptions) => ({
  types: UPDATE_TIMELINE,
  payload: options,
  meta: {
    plex: ({ library }: Instance) => library.timeline(options)
  }
})

const updatePlayerState = (playerState: string, queueItem: QueueItem) => {
  if (queueItem == null) {
    throw new Error('queueItem cannot be null')
  }

  return (dispatch: Dispatch, getState: GetState) => {
    const state = getState()
    const currentTime = selectTimeline.currentTime(state)
    const allTracks = selectAllTracks.values(state)
    const track = allTracks.get(queueItem.track)

    const timeout = setTimeout(() => {
      if (playerState !== PLAYER_STATE_STOPPED) {
        dispatch(updatePlayerState(playerState, queueItem))
      }
    }, CONFIG_TIMELINE_UPDATE_TIME)

    return dispatch(updateTimeline({
      trackId: track.id,
      queueItemId: queueItem.id,
      ratingKey: track.ratingKey,
      key: track.key,
      playerState,
      currentTime,
      duration: track.duration,
      timeout
    }))
  }
}

const sendTimelinePlay = (queueItem: QueueItem) => {
  return updatePlayerState(PLAYER_STATE_PLAYING, queueItem)
}

const sendTimelinePause = (queueItem: QueueItem) => {
  return updatePlayerState(PLAYER_STATE_PAUSED, queueItem)
}

const sendTimelineStop = (queueItem: QueueItem) => {
  return updatePlayerState(PLAYER_STATE_STOPPED, queueItem)
}

const setPlayerCurrentTime = (queueItem: QueueItem, currentTime: number) => ({
  type: SET_PLAYER_CURRENT_TIME,
  payload: { trackId: queueItem.track, currentTime }
})

export {
  updateTimeline,
  updatePlayerState,
  sendTimelinePlay,
  sendTimelinePause,
  sendTimelineStop,
  setPlayerCurrentTime
}
