/* @flow */

import { TRACK, normalize } from 'perplexed'

import {
  FETCH_PLAYLIST_ITEMS,
  RESET_PLAYLIST_ITEMS,
  MOVE_PLAYLIST_ITEM,
  REMOVE_TRACK_FROM_PLAYLIST,
  ADD_TRACK_TO_PLAYLIST
} from '../../constants'

import { createLibraryTypeChildrenStore } from '../../templates'

const store = createLibraryTypeChildrenStore({
  type: TRACK,
  actions: {
    fetch: FETCH_PLAYLIST_ITEMS,
    reset: RESET_PLAYLIST_ITEMS,
    move: MOVE_PLAYLIST_ITEM,
    remove: REMOVE_TRACK_FROM_PLAYLIST,
    add: ADD_TRACK_TO_PLAYLIST
  },
  rootSelector: (state) => state.playlists.items,
  reducerOptions: {
    getValues: (action) => {
      const { id } = action.payload
      const playlist = action.value.entities.playlists[id]
      return playlist.items
    },
    getTotal: (action) => {
      const { id } = action.payload
      const playlist = action.value.entities.playlists[id]
      return playlist.leafCount
    }
  },
  fetchItems: ({ library }, playlistId, start, end) =>
    normalize(library.playlistTracks(
      playlistId, { start, size: end - start }))
})

const reducer = store.reducer
const fetchPlaylistItems = store.fetchTypeChildren
const forceFetchPlaylistItems = store.forceFetchTypeChildren
const resetPlaylistItems = store.resetTypeChildren
const selectAllPlaylistItems = store.selectors

export {
  fetchPlaylistItems,
  forceFetchPlaylistItems,
  resetPlaylistItems,
  selectAllPlaylistItems
}

export default reducer
