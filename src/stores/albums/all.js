/* @flow */

import { ALBUM } from 'perplexed'

import { createLibraryTypeStore } from '../../templates'

import {
  FETCH_SEARCH_RESULTS,
  FETCH_LIBRARY_ALBUMS,
  FETCH_ARTIST_ALBUMS,
  FETCH_ALBUM
} from '../../constants'

const store = createLibraryTypeStore({
  actions: {
    fetch: FETCH_ALBUM
  },
  libraryType: ALBUM,
  entity: 'albums',
  rootSelector: (state) => state.albums.all,
  mergeActions: [
    FETCH_SEARCH_RESULTS.SUCCESS,
    FETCH_LIBRARY_ALBUMS.SUCCESS,
    FETCH_ARTIST_ALBUMS.SUCCESS
  ]
})

const reducer = store.reducer
const fetchAlbum = store.fetchType
const forceFetchAlbum = store.forceFetchType
const selectAllAlbums = store.selectors

export {
  fetchAlbum,
  forceFetchAlbum,
  selectAllAlbums
}

export default reducer
