/* @flow */

import middleware from './middleware'
import createRootReducer, { actions, selectors } from './stores'
import initializePlex from './initializePlex'

export {
  initializePlex,
  middleware,
  createRootReducer,
  actions,
  selectors
}
