// @flow

import {
  cacheValue,
  createValueSelector,
  AsyncValueReducer
} from '@stayradiated/mandarin'

import { PLEX_CHECK_PIN, PLEX_FETCH_PIN } from '../../constants'

import type { ReduxAction, Instance } from '../../types'

const rootSelector = (root) => root.plex.pin
const selectPin = createValueSelector(rootSelector)

const forceFetchPin = () => ({
  types: PLEX_FETCH_PIN,
  meta: {
    plex: ({ account }: Instance) => account.requestPin()
  }
})

const fetchPin = cacheValue(() => ({
  dispatch: forceFetchPin,
  validate: (value) => true,
  selectors: selectPin
}))

const checkPin = (pinId: number) => ({
  types: PLEX_CHECK_PIN,
  payload: { pinId },
  meta: {
    plex: ({ account }: Instance) => account.checkPin(pinId)
  }
})

const asyncReducer = new AsyncValueReducer({
  defaultValue: {}
})

const reducer = (state: Object, action: ReduxAction) => {
  if (state == null) {
    state = asyncReducer.initialState
  }

  switch (action.type) {
    case PLEX_FETCH_PIN.REQUEST:
      return asyncReducer.handleRequest(state, action)

    case PLEX_FETCH_PIN.FAILURE:
      return asyncReducer.handleFailure(state, action)

    case PLEX_FETCH_PIN.SUCCESS:
      return asyncReducer.handleSuccess(state, action)

    default:
      return state
  }
}

export { fetchPin, checkPin, selectPin }

export default reducer
