/* @flow */

import middleware from './middleware'
import createRootReducer from './stores'
import initializePlex from './initializePlex'

export * from './stores'

export {
  initializePlex,
  middleware,
  createRootReducer
}
