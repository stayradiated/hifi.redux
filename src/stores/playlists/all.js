/* @flow */

import { PLAYLIST, normalize } from 'perplexed'

import { createLibraryTypeStore } from '../../templates'

import {
  FETCH_SEARCH_RESULTS,
  FETCH_LIBRARY_PLAYLISTS,
  FETCH_LIBRARY_PLAYLISTS_REGULAR,
  FETCH_PLAYLIST
} from '../../constants'

const store = createLibraryTypeStore({
  actions: {
    fetch: FETCH_PLAYLIST
  },
  libraryType: PLAYLIST,
  entity: 'playlists',
  rootSelector: (state) => state.playlists.all,
  mergeActions: [
    FETCH_SEARCH_RESULTS.SUCCESS,
    FETCH_LIBRARY_PLAYLISTS.SUCCESS,
    FETCH_LIBRARY_PLAYLISTS_REGULAR.SUCCESS
  ],
  fetchItems: ({ library }, playlistId) =>
    normalize(library.playlist(playlistId))
})

const reducer = store.reducer
const fetchPlaylist = store.fetchType
const forceFetchPlaylist = store.forceFetchType
const selectAllPlaylists = store.selectors

export {
  fetchPlaylist,
  forceFetchPlaylist,
  selectAllPlaylists
}

export default reducer
