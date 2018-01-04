/* @flow */

import { actionTypes } from 'redux-localstorage'
import {
  FETCH_QUEUE,
  CREATE_QUEUE,
  PLAY_QUEUE_ITEM,
  STOP_QUEUE,
  MOVE_PLAY_QUEUE_ITEM,
  SHUFFLE_PLAY_QUEUE,
  UNSHUFFLE_PLAY_QUEUE
} from '../../constants'

import type { ReduxAction } from '../../types'

const initialState = {
  id: null,
  selectedItemId: null,
  items: [],
  shuffled: false
}

export default function (state: Object, action: ReduxAction) {
  if (state == null) {
    state = initialState
  }

  switch (action.type) {
    case actionTypes.INIT:
      return (action.payload && action.payload.queue)
        ? action.payload.queue
        : state

    case CREATE_QUEUE.REQUEST:
      const { initialTrackId } = action.payload
      return {
        ...state,
        selectedItemId: 0,
        items: [{
          id: 0,
          track: initialTrackId
        }]
      }

    case SHUFFLE_PLAY_QUEUE.REQUEST:
      return {
        ...state,
        shuffled: true
      }

    case UNSHUFFLE_PLAY_QUEUE.REQUEST:
      return {
        ...state,
        shuffled: false
      }

    case MOVE_PLAY_QUEUE_ITEM.REQUEST:
      const updatedItems = [...state.items]
      const { oldIndex, newIndex } = action.payload

      const item = updatedItems[oldIndex]
      updatedItems.splice(oldIndex, 1)
      updatedItems.splice(newIndex, 0, item)

      return {
        ...state,
        items: updatedItems
      }

    case FETCH_QUEUE.SUCCESS:
    case CREATE_QUEUE.SUCCESS:
    case MOVE_PLAY_QUEUE_ITEM.SUCCESS:
    case SHUFFLE_PLAY_QUEUE.SUCCESS:
    case UNSHUFFLE_PLAY_QUEUE.SUCCESS:
      return {
        ...state,
        ...action.value.result.id
      }

    case FETCH_QUEUE.FAILURE:
      return initialState

    case PLAY_QUEUE_ITEM:
      const { selectedItemId } = action.payload
      return {
        ...state,
        selectedItemId
      }

    case STOP_QUEUE:
      return {
        ...state,
        id: null,
        selectedItemId: null,
        items: []
      }

    default:
      return state
  }
}
