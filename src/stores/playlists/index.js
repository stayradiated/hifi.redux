/* @flow */

import { combineReducers } from 'redux'

import all from './all'
import items from './items'

export default combineReducers({
  all,
  items
})
