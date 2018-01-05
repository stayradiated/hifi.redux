import {
  normalize,
  PLAYLIST,
  PLAYLIST_TYPE_MUSIC,
  SORT_PLAYLISTS_BY_NAME
} from 'perplexed'

import {
  FETCH_LIBRARY_PLAYLISTS_REGULAR,
  SORT_LIBRARY_PLAYLISTS_REGULAR,
  RESET_LIBRARY_PLAYLISTS_REGULAR
} from '../../constants'

import { createLibraryTypeList } from '../../templates'

const store = createLibraryTypeList({
  type: PLAYLIST,
  actions: {
    fetch: FETCH_LIBRARY_PLAYLISTS_REGULAR,
    sort: SORT_LIBRARY_PLAYLISTS_REGULAR,
    reset: RESET_LIBRARY_PLAYLISTS_REGULAR
  },
  sort: {
    default: 'Name',
    descending: false,
    options: {
      Name: SORT_PLAYLISTS_BY_NAME
    }
  },
  rootSelector: (state) => state.library.playlistsRegular,
  reducerOptions: {
    getValues: (action) => action.value.result.id.playlists,
    getTotal: (action) => action.value.result.id.totalSize
  },
  fetchItems: ({ library }, section, options) =>
    normalize(library.playlists({
      ...options,
      smart: 0,
      playlistType: PLAYLIST_TYPE_MUSIC
    }))
})

const reducer = store.reducer
const fetchLibraryPlaylistsRegularRange = store.fetchLibraryTypeRange
const forceFetchLibraryPlaylistsRegularRange = store.forceFetchLibraryTypeRange
const fetchCurrentLibraryPlaylistsRegularRange = store.fetchCurrentLibraryTypeRange
const resetLibraryPlaylistsRegular = store.resetLibraryType
const resetCurrentLibraryPlaylistsRegular = store.resetCurrentLibraryType
const selectLibraryPlaylistsRegular = store.selectors
const sortLibraryPlaylistsRegular = store.sortLibraryType

export {
  fetchLibraryPlaylistsRegularRange,
  forceFetchLibraryPlaylistsRegularRange,
  fetchCurrentLibraryPlaylistsRegularRange,
  resetLibraryPlaylistsRegular,
  resetCurrentLibraryPlaylistsRegular,
  selectLibraryPlaylistsRegular,
  sortLibraryPlaylistsRegular
}

export default reducer
