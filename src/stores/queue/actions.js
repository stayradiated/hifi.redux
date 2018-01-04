/* @flow */

import { normalize } from 'perplexed'

import {
  SHUFFLE_PLAY_QUEUE,
  UNSHUFFLE_PLAY_QUEUE,
  FETCH_QUEUE,
  CREATE_QUEUE,
  PLAY_QUEUE_ITEM,
  STOP_QUEUE,
  MOVE_PLAY_QUEUE_ITEM
} from '../../constants'

import { selectPlex } from '../plex/instance'
import { selectAllTracks } from '../tracks/all'
import { selectAllAlbums } from '../albums/all'
import { selectAllArtists } from '../artists/all'
import { value as getLibrarySections } from '../library/sections/selectors'
import * as selectors from './selectors'

import type { Instance } from '../../types'

export const fetchQueue = (queueId: number) => ({
  types: FETCH_QUEUE,
  payload: { queueId },
  meta: {
    plex: ({ library }: Instance) => normalize(library.playQueue(queueId))
  }
})

type $createQueueOptions = {
  uri?: string,
  playlistId?: number,
  key?: string,
  initialTrackId: number,
}

export const createQueue = (options: $createQueueOptions) => ({
  types: CREATE_QUEUE,
  payload: { ...options },
  meta: {
    plex: ({ library }: Instance) => normalize(library.createQueue(options))
  }
})

type $createQueueFromURIOptions = {
  source: string,
  key?: string,
  initialTrackId: number,
}

export const createQueueFromURI = (options: $createQueueFromURIOptions) => {
  const { source, key, initialTrackId } = options

  return (dispatch: Function, getState: Function) => {
    const state = getState()
    const sections = getLibrarySections(state)
    const sectionId = selectPlex.librarySectionId(state)
    const section = sections.find((s) => s.id === sectionId)

    const path = encodeURIComponent(source)
    const uri = `library://${section.uuid}/directory/${path}`

    return dispatch(createQueue({ uri, key, initialTrackId }))
  }
}

export const createQueueFromPlexMix = (trackId: number) => (dispatch: Function, getState: Function) => {
  const state = getState()
  const allTracks = selectAllTracks.values(state)
  const track = allTracks.get(trackId)

  return dispatch(createQueueFromURI({
    source: track.plexMix.key,
    initialTrackId: trackId
  }))
}

export const createQueueFromAlbum = (albumId: number, trackId: number) => (dispatch: Function, getState: Function) => {
  const state = getState()
  const allAlbums = selectAllAlbums.values(state)
  const allTracks = selectAllTracks.values(state)
  const album = allAlbums.get(albumId)
  const track = allTracks.get(trackId)

  return dispatch(createQueueFromURI({
    source: album.key,
    key: track.key,
    initialTrackId: trackId
  }))
}

export const createQueueFromArtist = (artistId: number, trackId: number) => (dispatch: Function, getState: Function) => {
  const state = getState()
  const allArtists = selectAllArtists.values(state)
  const allTracks = selectAllTracks.values(state)
  const artist = allArtists.get(artistId)
  const track = allTracks.get(trackId)

  return dispatch(createQueueFromURI({
    source: artist.key,
    key: track.key,
    initialTrackId: trackId
  }))
}

export const createQueueFromPlaylist = (playlistId: number, trackId: number) => (dispatch: Function, getState: Function) => {
  const state = getState()
  const allTracks = selectAllTracks.values(state)
  const track = allTracks.get(trackId)

  return dispatch(createQueue({
    playlistId,
    key: track.key,
    initialTrackId: trackId
  }))
}

export const createQueueFromTrack = (trackId: number) => (dispatch: Function, getState: Function) => {
  const state = getState()
  const allTracks = selectAllTracks.values(state)
  const track = allTracks.get(trackId)
  const sectionId = selectPlex.librarySectionId(state)

  return dispatch(createQueueFromURI({
    key: track.key,
    source: `/library/sections/${sectionId}/all?type=10`,
    initialTrackId: trackId
  }))
}

export const playQueueItem = (queueItemId: number, trackId: number) => ({
  type: PLAY_QUEUE_ITEM,
  payload: {
    selectedItemId: queueItemId,
    trackId
  }
})

type $moveQueueItemOptions = {
  newIndex: number,
  oldIndex: number,
}

export const moveQueueItem = (options: $moveQueueItemOptions) => (dispatch: Function, getState: Function) => {
  const { newIndex, oldIndex } = options
  const state = getState()
  const queueId = selectors.queueId(state)
  const items = selectors.items(state)

  const playQueueId = items[oldIndex].id
  const afterQueueId = items[newIndex - (oldIndex > newIndex ? 1 : 0)].id

  return dispatch({
    types: MOVE_PLAY_QUEUE_ITEM,
    payload: { newIndex, oldIndex },
    meta: {
      plex: ({ library }) =>
        normalize(library.movePlayQueueItem(queueId, playQueueId, afterQueueId))
    }
  })
}

export const shuffleQueue = () => (dispatch: Function, getState: Function) => {
  const state = getState()
  const playQueueId = selectors.queueId(state)
  return dispatch({
    types: SHUFFLE_PLAY_QUEUE,
    meta: {
      plex: ({ library }) => normalize(library.shufflePlayQueue(playQueueId))
    }
  })
}

export const unshuffleQueue = () => (dispatch: Function, getState: Function) => {
  const state = getState()
  const playQueueId = selectors.queueId(state)
  return dispatch({
    types: UNSHUFFLE_PLAY_QUEUE,
    meta: {
      plex: ({ library }) => normalize(library.unshufflePlayQueue(playQueueId))
    }
  })
}

export const toggleShuffleQueue = () => (dispatch: Function, getState: Function) => {
  const state = getState()
  const shuffled = selectors.shuffled(state)
  return dispatch(shuffled ? unshuffleQueue() : shuffleQueue())
}

export const jumpToRelativeQueueItem = (delta: number) => (dispatch: Function, getState: Function) => {
  const state = getState()
  const selectedItemId = selectors.selectedItemId(state)
  const items = selectors.items(state)
  const index = items.findIndex((queueItem) => queueItem.id === selectedItemId)
  const nextIndex = index + delta
  const nextQueueItem = items[nextIndex]
  return dispatch(playQueueItem(nextQueueItem.id, nextQueueItem.track))
}

export const playNextTrack = () => {
  return jumpToRelativeQueueItem(1)
}

export const playPrevTrack = () => {
  return jumpToRelativeQueueItem(-1)
}

export const stopQueue = () => ({
  type: STOP_QUEUE
})
