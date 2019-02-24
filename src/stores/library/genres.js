// @flow

import { createLibraryTypeMapStore } from '../../templates'

import { FETCH_LIBRARY_GENRES } from '../../constants'

const store = createLibraryTypeMapStore({
  actions: {
    fetch: FETCH_LIBRARY_GENRES
  },
  rootSelector: (state) => state.library.genres,
  fetchItems: ({ library }, sectionId) => library.countries(sectionId)
})

const reducer = store.reducer

const fetchLibraryGenres = store.fetchLibraryType
const forceFetchLibraryGenres = store.forceFetchLibraryType
const fetchCurrentLibraryGenres = store.fetchCurrentLibraryType
const selectLibraryGenres = store.selectors

export {
  fetchLibraryGenres,
  forceFetchLibraryGenres,
  fetchCurrentLibraryGenres,
  selectLibraryGenres
}

export default reducer
