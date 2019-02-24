// @flow

import { combineReducers } from 'redux'

import account from './account'
import devices from './devices'
import connections from './connections'
import status from './status'

export default combineReducers({
  account,
  devices,
  connections,
  status
})
