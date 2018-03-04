import test from 'ava'
import configureMockStore from 'redux-mock-store'
import sinon from 'sinon'

import middleware from '../../middleware'
import reducer, { fetchCurrentLibraryGenres } from './genres'

const mockStore = configureMockStore(middleware)

const RESULT = 'RESULT'

test('fetchCurrentLibraryGenres', async (t) => {
  const store = mockStore({
    library: {
      genres: reducer()
    },
    ui: {
      librarySectionId: 1
    },
    plex: {
      instance: {
        library: {
          countries: sinon.stub().resolves(RESULT)
        }
      }
    }
  })

  await store.dispatch(fetchCurrentLibraryGenres())

  console.log(store.getActions())

  const state = store.getState()
  console.log(state.library.genres.values)

  t.pass()
})
