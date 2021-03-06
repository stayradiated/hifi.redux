// @flow

import {
  ARTIST,
  SORT_ARTISTS_BY_TITLE,
  SORT_ARTISTS_BY_DATE_ADDED,
  SORT_ARTISTS_BY_DATE_PLAYED,
  SORT_ARTISTS_BY_PLAYS
} from 'perplexed'

import {
  FETCH_LIBRARY_ARTISTS,
  SORT_LIBRARY_ARTISTS,
  RESET_LIBRARY_ARTISTS,
  FILTER_LIBRARY_ARTISTS
} from '../../constants'

import { createLibraryTypeListStore } from '../../templates'

const store = createLibraryTypeListStore({
  type: ARTIST,
  actions: {
    fetch: FETCH_LIBRARY_ARTISTS,
    sort: SORT_LIBRARY_ARTISTS,
    reset: RESET_LIBRARY_ARTISTS,
    filter: FILTER_LIBRARY_ARTISTS
  },
  sort: {
    default: 'Date Added',
    descending: true,
    options: {
      Title: SORT_ARTISTS_BY_TITLE,
      'Date Added': SORT_ARTISTS_BY_DATE_ADDED,
      'Date Played': SORT_ARTISTS_BY_DATE_PLAYED,
      Plays: SORT_ARTISTS_BY_PLAYS
    }
  },
  rootSelector: (state) => state.library.artists,
  reducerOptions: {
    getValues: (action) => action.value.result.id.artists
  }
})

const fetchLibraryArtistsRange = store.fetchLibraryTypeRange
const forceFetchLibraryArtistsRange = store.forceFetchLibraryTypeRange
const fetchCurrentLibraryArtistsRange = store.fetchCurrentLibraryTypeRange
const reducer = store.reducer
const resetLibraryArtists = store.resetLibraryType
const resetCurrentLibraryArtists = store.resetCurrentLibraryType
const selectLibraryArtists = store.selectors
const sortLibraryArtists = store.sortLibraryType

export {
  fetchLibraryArtistsRange,
  forceFetchLibraryArtistsRange,
  fetchCurrentLibraryArtistsRange,
  resetLibraryArtists,
  resetCurrentLibraryArtists,
  selectLibraryArtists,
  sortLibraryArtists
}

export default reducer
