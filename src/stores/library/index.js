// @flow

import { combineReducers } from 'redux'

import albums from './albums'
import artists from './artists'
import playlists from './playlists'
import playlistsRegular from './playlistsRegular'
import tracks from './tracks'
import sections from './sections'

export default combineReducers({
  albums,
  artists,
  sections,
  playlists,
  playlistsRegular,
  tracks
})
