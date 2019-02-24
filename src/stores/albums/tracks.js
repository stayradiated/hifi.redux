// @flow

import { TRACK } from 'perplexed'

import { FETCH_ALBUM_TRACKS, RESET_ALBUM_TRACKS } from '../../constants'

import { createLibraryTypeChildrenStore } from '../../templates'

const store = createLibraryTypeChildrenStore({
  type: TRACK,
  actions: {
    fetch: FETCH_ALBUM_TRACKS,
    reset: RESET_ALBUM_TRACKS
  },
  rootSelector: (state) => state.albums.tracks,
  reducerOptions: {
    getValues: (action) => action.value.result.id.tracks
  }
})

const reducer = store.reducer
const fetchAlbumTracks = store.fetchTypeChildren
const forceFetchAlbumTracks = store.forceFetchTypeChildren
const resetAlbumTracks = store.resetTypeChildren
const selectAllAlbumTracks = store.selectors

export {
  fetchAlbumTracks,
  forceFetchAlbumTracks,
  resetAlbumTracks,
  selectAllAlbumTracks
}

export default reducer
