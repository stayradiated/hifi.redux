/* @flow */

import { combineReducers } from 'redux'

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

import * as selectLibrarySections from './library/sections/selectors'
import * as selectQueue from './queue/selectors'
import * as selectSearch from './search/selectors'
import * as selectTimeline from './timeline/selectors'

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

export * from './albums/all'
export * from './albums/tracks'

export * from './artists/all'
export * from './artists/albums'

export * from './library/albums'
export * from './library/artists'
export * from './library/playlists'
export * from './library/playlistsRegular'
export * from './library/tracks'
export * from './library/sections/actions'

export * from './playlists/actions'
export * from './playlists/all'
export * from './playlists/items'

export * from './plex/auth'
export * from './plex/instance'
export * from './plex/pin'

export * from './queue/actions'

export * from './search/actions'

export * from './servers/status'
export * from './servers/devices'
export * from './servers/connections'
export * from './servers/account'

export * from './timeline/actions'

export * from './tracks/all'

export * from './ui'

export * from './user'

export {
  selectLibrarySections,
  selectQueue,
  selectSearch,
  selectTimeline
}

export default createRootReducer
