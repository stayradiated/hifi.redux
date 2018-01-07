/* @flow */

import { TRACK } from 'perplexed'
import { c } from '@stayradiated/mandarin'

import { createLibraryTypeStore } from '../../templates'

import {
  CREATE_QUEUE,
  FETCH_ALBUM_TRACKS,
  FETCH_PLAYLIST_ITEMS,
  FETCH_QUEUE,
  FETCH_SEARCH_RESULTS,
  FETCH_TRACK,
  SHUFFLE_PLAY_QUEUE,
  UNSHUFFLE_PLAY_QUEUE,
  FETCH_LIBRARY_TRACKS
} from '../../constants'

import type { Instance } from '../../types'

const RATE_TRACK = c('RATE_TRACK')

const store = createLibraryTypeStore({
  actions: {
    fetch: FETCH_TRACK
  },
  libraryType: TRACK,
  entity: 'tracks',
  rootSelector: (state) => state.tracks.all,
  mergeActions: [
    CREATE_QUEUE.SUCCESS,
    FETCH_ALBUM_TRACKS.SUCCESS,
    FETCH_PLAYLIST_ITEMS.SUCCESS,
    FETCH_QUEUE.SUCCESS,
    FETCH_SEARCH_RESULTS.SUCCESS,
    SHUFFLE_PLAY_QUEUE.SUCCESS,
    UNSHUFFLE_PLAY_QUEUE.SUCCESS,
    FETCH_LIBRARY_TRACKS.SUCCESS
  ],
  customActions: {
    [RATE_TRACK.REQUEST]: (state, action) => {
      const { trackId, rating } = action.payload
      const valueMap = new Map(state.values)
      valueMap.set(trackId, {
        ...valueMap.get(trackId),
        userRating: rating
      })
      return {
        ...state,
        values: valueMap
      }
    }
  }
})

const rateTrack = (trackId: string, rating: number) => ({
  types: RATE_TRACK,
  payload: { trackId, rating },
  meta: {
    plex: ({ library }: Instance) => library.rate(trackId, rating)
  }
})

const reducer = store.reducer
const forceFetchTrack = store.forceFetchType
const fetchTrack = store.fetchType
const selectAllTracks = store.selectors

export {
  forceFetchTrack,
  fetchTrack,
  selectAllTracks,
  rateTrack
}

export default reducer
