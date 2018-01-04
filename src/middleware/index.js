/* @flow */

import ReduxPromise from 'redux-promise'
import ReduxThunk from 'redux-thunk'
import ReduxAsync from '@stayradiated/mandarin'

import plexMiddleware from './plex'

const middleware = [
  ReduxPromise,
  ReduxThunk,
  plexMiddleware,
  ReduxAsync
]

export default middleware
