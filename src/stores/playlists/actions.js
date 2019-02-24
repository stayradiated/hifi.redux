// @flow

import {
  ADD_TRACK_TO_PLAYLIST,
  REMOVE_TRACK_FROM_PLAYLIST,
  SET_PLAYLIST_TITLE,
  MOVE_PLAYLIST_ITEM
} from '../../constants'

import { selectAllPlaylistItems } from './items'
import { value as getLibrarySections } from '../library/sections/selectors'
import { selectLibrarySectionId } from '../ui'
import { selectAllTracks } from '../tracks/all'

import type { Instance, Dispatch, GetState } from '../../types'

const addTrackToPlaylist = (trackId: number, playlistId: number) => (
  dispatch: Function,
  getState: Function
) => {
  const state = getState()

  const sections = getLibrarySections(state)
  const sectionId = selectLibrarySectionId(state)
  const section = sections.find((s) => s.id === sectionId)

  const allTracks = selectAllTracks.values(state)
  const track = allTracks.get(trackId)
  const source = track.key

  const path = encodeURIComponent(source)
  const uri = `library://${section.uuid}/item/${path}`

  return dispatch({
    types: ADD_TRACK_TO_PLAYLIST,
    payload: { id: playlistId, trackId },
    meta: {
      plex: ({ library }: Instance) => library.addToPlaylist(playlistId, uri)
    }
  })
}

const removeItemFromPlaylist = (itemId: number, playlistId: number) => ({
  types: REMOVE_TRACK_FROM_PLAYLIST,
  payload: { id: playlistId, itemId },
  meta: {
    plex: ({ library }: Instance) =>
      library.removeFromPlaylist(playlistId, itemId)
  }
})

const setPlaylistTitle = (playlistId: number, title: string) => ({
  types: SET_PLAYLIST_TITLE,
  payload: { id: playlistId, title },
  meta: {
    plex: ({ library }: Instance) =>
      library.editPlaylistTitle(playlistId, title)
  }
})

type $movePlaylistItemOptions = {
  playlistId: number,
  newIndex: number,
  oldIndex: number
}

const movePlaylistItem = (options: $movePlaylistItemOptions) => (
  dispatch: Dispatch,
  getState: GetState
) => {
  const { playlistId, newIndex, oldIndex } = options
  const state = getState()
  const allPlaylistItems = selectAllPlaylistItems.values(state)
  const items = allPlaylistItems.get(playlistId)

  const itemId = items[oldIndex].id
  const afterItem = items[newIndex - (oldIndex > newIndex ? 1 : 0)]
  const afterItemId = afterItem != null ? afterItem.id : null

  return dispatch({
    types: MOVE_PLAYLIST_ITEM,
    payload: { id: playlistId, newIndex, oldIndex },
    meta: {
      plex: ({ library }) =>
        library.movePlaylistItem(playlistId, itemId, afterItemId)
    }
  })
}

export {
  addTrackToPlaylist,
  removeItemFromPlaylist,
  setPlaylistTitle,
  movePlaylistItem
}
