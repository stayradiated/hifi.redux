import { compose, createStore, applyMiddleware } from 'redux'
import ReduxPromise from 'redux-promise'
import ReduxThunk from 'redux-thunk'
import ReduxAsync from '@stayradiated/mandarin'
import { createLogger } from 'redux-logger'
import persistState from 'redux-localstorage'
import adapter from 'redux-localstorage/lib/adapters/localStorage'
import filter from 'redux-localstorage-filter'

// middleware
import plexMiddleware from './middleware/plex'

import rootReducer from './stores'

export default function store (options = {}) {
  const middleware = applyMiddleware(
    ...options.middleware,
    ReduxPromise,
    ReduxThunk,
    plexMiddleware,
    ReduxAsync,
    createLogger({
      // predicate: () => false,
      collapsed: true
    })
  )

  const storage = filter([
    'queue',
    'user',
    'plex.instance.serverId',
    'plex.instance.librarySectionId'
  ])(adapter(window.localStorage))

  return createStore(rootReducer, compose(
    middleware,
    persistState(storage, 'plex')
  ))
}
