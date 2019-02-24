// @flow

import { createSelector } from 'reselect'

import { PLAYER_STATE_PAUSED } from '../../constants'

import { trackId as selectTrackId } from '../queue/selectors'

const root = (state: Object) => state.timeline
const queueItems = createSelector(root, (_root) => _root.queueItems)

const currentQueueItem = createSelector(
  queueItems,
  selectTrackId,
  (_queueItems, _trackId) => _queueItems.get(_trackId)
)

const currentTime = createSelector(currentQueueItem, (_currentQueueItem) => {
  return _currentQueueItem ? _currentQueueItem.currentTime : 0
})

const playerState = createSelector(currentQueueItem, (_currentQueueItem) => {
  return _currentQueueItem ? _currentQueueItem.playerState : PLAYER_STATE_PAUSED
})

export { root, queueItems, currentQueueItem, currentTime, playerState }
