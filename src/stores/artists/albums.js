// @flow

import { ALBUM } from 'perplexed'

import { FETCH_ARTIST_ALBUMS, RESET_ARTIST_ALBUMS } from '../../constants'

import { createLibraryTypeChildrenStore } from '../../templates'

const store = createLibraryTypeChildrenStore({
  type: ALBUM,
  actions: {
    fetch: FETCH_ARTIST_ALBUMS,
    reset: RESET_ARTIST_ALBUMS
  },
  rootSelector: (state) => state.artists.albums,
  reducerOptions: {
    getValues: (action) => action.value.result.id.albums
  }
})

const reducer = store.reducer
const fetchArtistAlbums = store.fetchTypeChildren
const forceFetchArtistAlbums = store.forceFetchTypeChildren
const resetArtistAlbums = store.resetTypeChildren
const selectAllArtistAlbums = store.selectors

export {
  fetchArtistAlbums,
  forceFetchArtistAlbums,
  resetArtistAlbums,
  selectAllArtistAlbums
}

export default reducer
