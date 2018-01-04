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

import * as queueActions from './queue/actions'
import * as queueSelectors from './queue/selectors'
import * as searchActions from './search/actions'
import * as searchSelectors from './search/selectors'
import * as timelineActions from './timeline/actions'
import * as timelineSelectors from './timeline/selectors'
import * as playlistsActions from './playlists/actions'
import * as librarySectionsActions from './library/sections/actions'
import * as librarySectionsSelectors from './library/sections/selectors'

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

const actions = {
  librarySections: librarySectionsActions,
  playlists: playlistsActions,
  queue: queueActions,
  search: searchActions,
  timeline: timelineActions
}

const selectors = {
  librarySections: librarySectionsSelectors,
  queue: queueSelectors,
  search: searchSelectors,
  timeline: timelineSelectors
}

export {
  actions,
  selectors
}

export default createRootReducer
