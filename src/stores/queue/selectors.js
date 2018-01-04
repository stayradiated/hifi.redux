/* @flow */

import { createSelector } from 'reselect'

import { selectPlex } from '../plex/instance'
import { selectAllTracks } from '../tracks/all'

const root = (state: Object) => state.queue

const queueId = createSelector(root, (_root) => _root.id)
const items = createSelector(root, (_root) => _root.items)
const selectedItemId = createSelector(root, (_root) => _root.selectedItemId)
const shuffled = createSelector(root, (_root) => _root.shuffled)

const queueItem = createSelector(
  root,
  (_root) => {
    const item = _root.items.find((qI) => qI.id === _root.selectedItemId)
    if (item == null) {
      return null
    }
    return item
  }
)

const trackId = createSelector(
  queueItem,
  (_item) => {
    if (_item == null) {
      return null
    }
    return _item.track
  }
)

const track = createSelector(
  trackId, selectAllTracks.values,
  (_trackId, allTracks) => {
    return allTracks.get(_trackId) || null
  }
)

const trackSrc = createSelector(
  track, selectPlex.library,
  (_track, library) => {
    if (library != null && _track != null) {
      return library.trackSrc(_track)
    }
    return null
  }
)

export {
  root,
  queueId,
  items,
  selectedItemId,
  shuffled,
  queueItem,
  trackId,
  track,
  trackSrc
}
