// @flow

import { Client, Account } from 'perplexed'

import config from '../config.json'
import { selectUser } from './stores/user'

import { PLEX_INITIALIZE } from './constants'

const initializePlex = () => (dispatch: Function, getState: Function) => {
  const state = getState()
  const authToken = selectUser.authToken(state)

  const client = new Client(config.options)
  const account = new Account(client, authToken)

  return dispatch({
    type: PLEX_INITIALIZE,
    payload: { client, account }
  })
}

export default initializePlex
