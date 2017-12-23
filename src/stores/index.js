import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

// reducers
import albums from './albums'
import artists from './artists'
import library from './library'
import playlists from './playlists'
import plex from './plex'
import queue from './queue'
import search from './search'
import servers from './servers'
import timeline from './timeline'
import tracks from './tracks'
import ui from './ui'
import user from './user'

const rootReducer = combineReducers({
  albums,
  artists,
  library,
  playlists,
  plex,
  queue,
  routing: routerReducer,
  search,
  servers,
  timeline,
  tracks,
  ui,
  user
})

export default rootReducer
