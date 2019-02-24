// @flow

import { ARTIST } from 'perplexed'

import { createLibraryTypeStore } from '../../templates'

import {
  FETCH_SEARCH_RESULTS,
  FETCH_LIBRARY_ARTISTS,
  FETCH_ARTIST
} from '../../constants'

const store = createLibraryTypeStore({
  actions: {
    fetch: FETCH_ARTIST
  },
  libraryType: ARTIST,
  entity: 'artists',
  rootSelector: (state) => state.artists.all,
  mergeActions: [FETCH_SEARCH_RESULTS.SUCCESS, FETCH_LIBRARY_ARTISTS.SUCCESS]
})

const reducer = store.reducer
const fetchArtist = store.fetchType
const forceFetchArtist = store.forceFetchType
const selectAllArtists = store.selectors

export { fetchArtist, forceFetchArtist, selectAllArtists }

export default reducer
