/* @flow */

import { TRACK, normalize } from 'perplexed'

import { FETCH_PLAYLIST_ITEMS, RESET_PLAYLIST_ITEMS } from '../../constants'

import { createLibraryTypeChildrenStore } from '../../templates'

const store = createLibraryTypeChildrenStore({
  type: TRACK,
  actions: {
    fetch: FETCH_PLAYLIST_ITEMS,
    reset: RESET_PLAYLIST_ITEMS
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
