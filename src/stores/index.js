/* @flow */

import { combineReducers } from 'redux'

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

type Options = {
  reducers: Object
}

const createRootReducer = (options: Options) => {
  const { reducers } = options

  return combineReducers({
    ...reducers,
    albums,
    artists,
    library,
    playlists,
    plex,
    queue,
    search,
    servers,
    timeline,
    tracks,
    ui,
    user
  })
}

export default createRootReducer
